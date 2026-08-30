using System.Reflection;
using System.Text.Json;
using Gardener.Blazor.Components;
using Gardener.Blazor.Generated;
using Gardener.Blazor.Models;
using Gardener.Blazor.Services;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.JSInterop;

var failures = new List<string>();
void Assert(bool condition, string message)
{
    if (!condition) failures.Add(message);
}

var assembly = typeof(GardenerComponentBase).Assembly;
var generated = assembly.GetExportedTypes()
    .Where(type => type.Namespace == "Gardener.Blazor.Components" && type.BaseType == typeof(GardenerComponentBase) && GardenerCatalog.ByComponentType.ContainsKey(type.Name))
    .OrderBy(type => type.Name, StringComparer.Ordinal)
    .ToArray();

Assert(generated.Length == 506, $"Expected 506 generated components, got {generated.Length}.");
Assert(GardenerCatalog.Components.Count == 506, "Catalog must contain 506 definitions.");
Assert(GardenerThemePresets.All.Count == 42 && GardenerThemePresets.All.Distinct(StringComparer.Ordinal).Count() == 42, "All 42 color themes must be exposed.");
Assert(GardenerBehaviors.All.Count == 66 && GardenerBehaviors.All.Distinct(StringComparer.Ordinal).Count() == 66, "All 66 runtime behaviors must be exposed.");
Assert(GardenerEvents.All.Count == 75 && GardenerEvents.Guards.Count == 7, "All 75 runtime events and 7 guards must be exposed.");
Assert(GardenerRuntimeCatalog.Behaviors.Count == 66 && GardenerRuntimeCatalog.Events.Count == 75, "Runtime member/event catalogs must be complete.");
Assert(GardenerAssets.Platforms.Count == 5 && GardenerAssets.ComponentPacks.Count == 28, "All platform/component asset entries must be exposed.");
Assert(GardenerCatalog.ByName.Count == 506 && GardenerCatalog.ByComponentType.Count == 506, "Catalog lookup maps must be complete.");
Assert(generated.All(type => type.IsPublic && type.IsSealed && !type.IsGenericType), "Generated components must be public, sealed, and non-generic.");
Assert(generated.Select(type => type.Name).SequenceEqual(GardenerCatalog.Components.Select(item => item.ComponentType).OrderBy(name => name, StringComparer.Ordinal)), "Generated types and catalog differ.");
Assert(GardenerCatalog.Components.All(item => !string.IsNullOrWhiteSpace(item.Name) && !string.IsNullOrWhiteSpace(item.Category) && !string.IsNullOrWhiteSpace(item.Kind) && !string.IsNullOrWhiteSpace(item.Selector) && !string.IsNullOrWhiteSpace(item.DefaultTag)), "Every component needs complete metadata.");
Assert(GardenerCatalog.Components.All(item => !string.IsNullOrWhiteSpace(item.Status)), "Every component status must be preserved.");
Assert(GardenerCatalog.ByName["tabs"].Accessibility?.Roles.Contains("tablist") == true, "Component accessibility metadata was not preserved.");
Assert(GardenerCatalog.ByName["fieldset"].DefaultTag == "fieldset", "Fieldset must use a semantic default tag.");

var parameters = typeof(GardenerComponentBase).GetProperties(BindingFlags.Instance | BindingFlags.Public)
    .Where(property => property.GetCustomAttribute<ParameterAttribute>() is not null)
    .Select(property => property.Name)
    .OrderBy(name => name, StringComparer.Ordinal)
    .ToArray();
var expectedParameters = new[] { "AdditionalAttributes", "As", "ChildContent", "Class", "Config", "EventNames", "Id", "Initialize", "OnEvent", "OnValueChange", "PreventDefaultEvents", "State", "States", "Style", "Value", "ValueChanged", "ValueEvent", "ValueKey", "Variant", "Variants" }.OrderBy(name => name, StringComparer.Ordinal);
Assert(parameters.SequenceEqual(expectedParameters), "GardenerComponentBase parameter contract changed.");

var handles = new[] { "Element", "RefreshAsync", "DestroyAsync", "FocusAsync", "GetBehaviorMembersAsync", "InvokeBehaviorAsync" };
Assert(handles.All(name => typeof(GardenerComponentBase).GetMember(name, BindingFlags.Instance | BindingFlags.Public).Length > 0), "Component handle API is incomplete.");
Assert(typeof(GardenerField<>).BaseType?.GetGenericTypeDefinition().Name == "InputBase`1", "GardenerField<TValue> must integrate with EditForm.");

var services = new ServiceCollection();
services.AddLogging();
services.AddSingleton<IJSRuntime, NullJsRuntime>();
services.AddGardenerBlazor(options => options.JavaScriptModulePath = "./test.js");
await using var provider = services.BuildServiceProvider(validateScopes: true);
await using (var scope = provider.CreateAsyncScope())
{
    Assert(scope.ServiceProvider.GetRequiredService<GardenerRuntime>() is not null, "Runtime DI registration failed.");
    Assert(scope.ServiceProvider.GetRequiredService<GardenerThemeService>() is not null, "Theme DI registration failed.");
    Assert(scope.ServiceProvider.GetRequiredService<GardenerToastService>() is not null, "Toast DI registration failed.");
    Assert(scope.ServiceProvider.GetRequiredService<GardenerTauriService>() is not null, "Tauri DI registration failed.");
    Assert(scope.ServiceProvider.GetRequiredService<GardenerElectronService>() is not null, "Electron DI registration failed.");
}

await using var renderScope = provider.CreateAsyncScope();
await using (var renderer = new HtmlRenderer(renderScope.ServiceProvider, renderScope.ServiceProvider.GetRequiredService<ILoggerFactory>()))
{
    await renderer.Dispatcher.InvokeAsync(async () =>
    {
        foreach (var type in generated)
        {
            var rendered = await renderer.RenderComponentAsync(type, ParameterView.Empty);
            var html = rendered.ToHtmlString();
            var definition = GardenerCatalog.ByComponentType[type.Name];
            Assert(!string.IsNullOrWhiteSpace(html), $"Static SSR produced no HTML for {type.Name}.");
            if (definition.ClassName is not null) Assert(html.Contains(definition.ClassName, StringComparison.Ordinal), $"Static SSR omitted root class for {type.Name}.");
            foreach (var behavior in definition.Behaviors) Assert(html.Contains($"data-g-{ToKebab(behavior)}", StringComparison.Ordinal), $"Static SSR omitted behavior {behavior} for {type.Name}.");
        }

        var attributes = new Dictionary<string, object> { ["class"] = "external", ["style"] = "color:red" };
        var config = new Dictionary<string, object?> { ["maxItems"] = 3, ["data-g-selection"] = new[] { "a", "b" } };
        var probe = await renderer.RenderComponentAsync<GButton>(ParameterView.FromDictionary(new Dictionary<string, object?>
        {
            [nameof(GardenerComponentBase.AdditionalAttributes)] = attributes,
            [nameof(GardenerComponentBase.Class)] = "local",
            [nameof(GardenerComponentBase.Style)] = "background:blue",
            [nameof(GardenerComponentBase.Variant)] = "primary",
            [nameof(GardenerComponentBase.Config)] = config
        }));
        var probeHtml = probe.ToHtmlString();
        Assert(probeHtml.StartsWith("<button", StringComparison.Ordinal) && probeHtml.Contains("type=\"button\"", StringComparison.Ordinal), "Button semantic SSR contract failed.");
        Assert(probeHtml.Contains("external local g-btn g-btn-primary", StringComparison.Ordinal), "Class/variant merge failed.");
        Assert(probeHtml.Contains("color:red;background:blue", StringComparison.Ordinal), "Style merge failed.");
        Assert(probeHtml.Contains("data-g-max-items=\"3\"", StringComparison.Ordinal) && probeHtml.Contains("data-g-selection=", StringComparison.Ordinal), "Configuration attribute normalization failed.");
    });
}

var root = FindRoot();
var publicApi = JsonDocument.Parse(File.ReadAllText(Path.Combine(root, "metadata", "public-api.json"))).RootElement;
Assert(publicApi.GetProperty("version").GetString() == "1.0.0", "Public API version must be 1.0.0.");
Assert(publicApi.GetProperty("targetFramework").GetString() == "net10.0", "Stable target must be net10.0.");
Assert(publicApi.GetProperty("compatibleFrameworks").EnumerateArray().Any(item => item.GetString() == "net11.0"), "net11.0 compatibility declaration missing.");
Assert(publicApi.GetProperty("components").GetInt32() == 506 && publicApi.GetProperty("behaviors").GetInt32() == 66, "Metadata counts are incorrect.");

if (failures.Count > 0)
{
    Console.Error.WriteLine($"Contract failures ({failures.Count}):");
    failures.ForEach(failure => Console.Error.WriteLine($"- {failure}"));
    return 1;
}

Console.WriteLine("Gardener.Blazor contracts passed: 506 SSR renders, 66 behaviors, 75 events, 42 themes, DI, forms, handles, metadata, net10/net11 boundary.");
return 0;

static string FindRoot()
{
    var current = new DirectoryInfo(Environment.CurrentDirectory);
    while (current is not null)
    {
        if (File.Exists(Path.Combine(current.FullName, "package.json")) && Directory.Exists(Path.Combine(current.FullName, "src", "Gardener.Blazor"))) return current.FullName;
        current = current.Parent;
    }
    throw new DirectoryNotFoundException("Unable to locate the blazor workspace root.");
}

static string ToKebab(string value) => string.Concat(value.Select((character, index) => char.IsUpper(character) && index > 0 ? $"-{char.ToLowerInvariant(character)}" : char.ToLowerInvariant(character).ToString())).Replace('_', '-');

sealed class NullJsRuntime : IJSRuntime
{
    public ValueTask<TValue> InvokeAsync<TValue>(string identifier, object?[]? args) => new(default(TValue)!);
    public ValueTask<TValue> InvokeAsync<TValue>(string identifier, CancellationToken cancellationToken, object?[]? args) => new(default(TValue)!);
}
