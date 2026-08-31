using System.Globalization;
using System.Text;
using System.Text.Json;
using Gardenerim.Blazor.Models;
using Gardenerim.Blazor.Services;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.JSInterop;

namespace Gardenerim.Blazor.Components;

/// <summary>Shared rendering, value binding, and DOM lifecycle for every generated Gardenerim component.</summary>
public abstract class GardenerimComponentBase : ComponentBase, IAsyncDisposable
{
    private DotNetObjectReference<GardenerimComponentBase>? _receiver;
    private string? _mountedSignature;
    private bool _mounted;

    [Inject] private GardenerimRuntime Runtime { get; set; } = default!;

    protected abstract GardenerimComponentDefinition Definition { get; }
    protected virtual IReadOnlyList<string> RuntimeBehaviors => Definition.Behaviors;

    [Parameter] public string? As { get; set; }
    [Parameter] public string? Id { get; set; }
    [Parameter] public string? Class { get; set; }
    [Parameter] public string? Style { get; set; }
    [Parameter] public string? Variant { get; set; }
    [Parameter] public IReadOnlyList<string>? Variants { get; set; }
    [Parameter] public string? State { get; set; }
    [Parameter] public IReadOnlyList<string>? States { get; set; }
    [Parameter] public IReadOnlyDictionary<string, object?>? Config { get; set; }
    [Parameter] public bool Initialize { get; set; } = true;
    [Parameter] public object? Value { get; set; }
    [Parameter] public EventCallback<object?> ValueChanged { get; set; }
    [Parameter] public string ValueEvent { get; set; } = "gardener:change";
    [Parameter] public string ValueKey { get; set; } = "value";
    [Parameter] public EventCallback<GardenerimValueChangedEventArgs> OnValueChange { get; set; }
    [Parameter] public IReadOnlyList<string>? EventNames { get; set; }
    [Parameter] public IReadOnlyList<string>? PreventDefaultEvents { get; set; }
    [Parameter] public EventCallback<GardenerimEventArgs> OnEvent { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter(CaptureUnmatchedValues = true)] public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <summary>The rendered root element.</summary>
    public ElementReference Element { get; private set; }

    public ValueTask RefreshAsync(CancellationToken cancellationToken = default) => Runtime.RefreshAsync(Element, cancellationToken);
    public ValueTask DestroyAsync(CancellationToken cancellationToken = default) => Runtime.DestroyAsync(Element, cancellationToken);
    public ValueTask FocusAsync(CancellationToken cancellationToken = default) => Runtime.FocusAsync(Element, cancellationToken);
    public ValueTask<IReadOnlyList<string>> GetBehaviorMembersAsync(string behavior, CancellationToken cancellationToken = default) => Runtime.GetBehaviorMembersAsync(Element, behavior, cancellationToken);
    public ValueTask<T?> InvokeBehaviorAsync<T>(string behavior, string member, object?[]? arguments = null, CancellationToken cancellationToken = default) => Runtime.InvokeBehaviorAsync<T>(Element, behavior, member, arguments, cancellationToken);

    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        var definition = Definition;
        var tag = string.IsNullOrWhiteSpace(As) ? definition.DefaultTag : As;
        var sequence = 0;
        builder.OpenElement(sequence++, tag!);
        if (AdditionalAttributes is not null)
        {
            builder.AddMultipleAttributes(sequence++, AdditionalAttributes);
        }

        Add(builder, ref sequence, "id", Id);
        Add(builder, ref sequence, "style", BuildStyle());
        builder.AddAttribute(sequence++, "class", BuildClass(definition));

        if (Initialize)
        {
            foreach (var behavior in RuntimeBehaviors)
            {
                builder.AddAttribute(sequence++, $"data-g-{ToKebab(behavior)}", string.Empty);
            }
        }

        foreach (var pair in Config ?? EmptyConfig)
        {
            if (pair.Value is null or false)
            {
                continue;
            }

            builder.AddAttribute(sequence++, DataAttributeName(pair.Key), pair.Value is true ? string.Empty : FormatConfigValue(pair.Value));
        }

        var inputType = AttributeValue("type");
        if (string.Equals(tag, "button", StringComparison.OrdinalIgnoreCase) && inputType is null)
        {
            builder.AddAttribute(sequence++, "type", "button");
        }

        if (Value is not null)
        {
            if (string.Equals(tag, "input", StringComparison.OrdinalIgnoreCase) && string.Equals(inputType, "checkbox", StringComparison.OrdinalIgnoreCase) && Value is bool isChecked)
            {
                builder.AddAttribute(sequence++, "checked", isChecked);
            }
            else
            {
                builder.AddAttribute(sequence++, "value", Value);
            }
        }

        if (ValueChanged.HasDelegate || OnValueChange.HasDelegate)
        {
            var eventAttribute = UsesChangeEvent(tag, inputType) ? "onchange" : "oninput";
            builder.AddAttribute(sequence++, eventAttribute, EventCallback.Factory.Create<ChangeEventArgs>(this, HandleNativeValueAsync));
        }

        builder.AddElementReferenceCapture(sequence++, reference => Element = reference);
        builder.AddContent(sequence++, ChildContent);
        builder.CloseElement();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        var signature = BuildMountSignature();
        if (_mounted && string.Equals(signature, _mountedSignature, StringComparison.Ordinal))
        {
            return;
        }

        _receiver ??= DotNetObjectReference.Create(this);
        try
        {
            await Runtime.MountAsync(Element, Initialize, NormalizeEvent(ValueEvent), ValueKey, ValueChanged.HasDelegate || OnValueChange.HasDelegate, EventNames ?? [], PreventDefaultEvents ?? [], ValueChanged.HasDelegate || OnValueChange.HasDelegate || OnEvent.HasDelegate ? _receiver : null);
            _mounted = true;
            _mountedSignature = signature;
        }
        catch (InvalidOperationException)
        {
            // Static SSR has no active JS runtime. Interactive rendering retries after connection.
        }
        catch (JSDisconnectedException)
        {
        }
    }

    [JSInvokable]
    public async Task NotifyGardenerimValueChanged(JsonElement? value, string eventName, JsonElement? detail)
    {
        object? normalized = value is null ? null : NormalizeJson(value.Value);
        if (ValueChanged.HasDelegate)
        {
            await ValueChanged.InvokeAsync(normalized);
        }
        if (OnValueChange.HasDelegate)
        {
            await OnValueChange.InvokeAsync(new GardenerimValueChangedEventArgs(normalized, eventName, detail?.Clone()));
        }
    }

    [JSInvokable]
    public async Task NotifyGardenerimEvent(JsonElement? detail, string eventName, bool defaultPrevented)
    {
        if (OnEvent.HasDelegate)
        {
            await OnEvent.InvokeAsync(new GardenerimEventArgs(detail is null ? null : NormalizeJson(detail.Value), eventName, defaultPrevented));
        }
    }

    private async Task HandleNativeValueAsync(ChangeEventArgs args)
    {
        if (ValueChanged.HasDelegate)
        {
            await ValueChanged.InvokeAsync(args.Value);
        }
        if (OnValueChange.HasDelegate)
        {
            await OnValueChange.InvokeAsync(new GardenerimValueChangedEventArgs(args.Value, "change"));
        }
    }

    private string BuildClass(GardenerimComponentDefinition definition)
    {
        var names = new List<string>();
        AddTokens(names, AttributeValue("class"));
        AddTokens(names, Class);
        AddTokens(names, definition.ClassName);
        foreach (var variant in Tokens(Variant).Concat(Variants ?? []))
        {
            names.Add(definition.ClassName is null ? variant : $"{definition.ClassName}-{variant}");
        }
        foreach (var state in Tokens(State).Concat(States ?? []))
        {
            names.Add(state.StartsWith("is-", StringComparison.Ordinal) ? state : $"is-{state}");
        }
        return string.Join(' ', names.Where(static value => !string.IsNullOrWhiteSpace(value)).Distinct(StringComparer.Ordinal));
    }

    private string? BuildStyle()
    {
        var additional = AttributeValue("style");
        if (string.IsNullOrWhiteSpace(additional)) return Style;
        if (string.IsNullOrWhiteSpace(Style)) return additional;
        return $"{additional.TrimEnd().TrimEnd(';')};{Style.TrimStart()}";
    }

    private string BuildMountSignature()
    {
        var signature = new StringBuilder()
            .Append(Initialize).Append('|')
            .Append(ValueEvent).Append('|')
            .Append(ValueKey).Append('|')
            .AppendJoin(',', RuntimeBehaviors.Order(StringComparer.Ordinal))
            .Append('|').Append(ValueChanged.HasDelegate).Append('|').Append(OnValueChange.HasDelegate).Append('|').Append(OnEvent.HasDelegate)
            .Append('|').AppendJoin(',', (EventNames ?? []).Select(NormalizeEvent).Order(StringComparer.Ordinal))
            .Append('|').AppendJoin(',', (PreventDefaultEvents ?? []).Select(NormalizeEvent).Order(StringComparer.Ordinal));
        foreach (var pair in (Config ?? EmptyConfig).OrderBy(static pair => pair.Key, StringComparer.Ordinal))
        {
            signature.Append('|').Append(DataAttributeName(pair.Key)).Append('=').Append(FormatConfigValue(pair.Value));
        }
        return signature.ToString();
    }

    private static object? NormalizeJson(JsonElement element) => element.ValueKind switch
    {
        JsonValueKind.Null or JsonValueKind.Undefined => null,
        JsonValueKind.String => element.GetString(),
        JsonValueKind.True => true,
        JsonValueKind.False => false,
        JsonValueKind.Number when element.TryGetInt64(out var integer) => integer,
        JsonValueKind.Number when element.TryGetDecimal(out var number) => number,
        JsonValueKind.Number => element.GetDouble(),
        JsonValueKind.Array => element.EnumerateArray().Select(NormalizeJson).ToArray(),
        JsonValueKind.Object => element.EnumerateObject().ToDictionary(static property => property.Name, static property => NormalizeJson(property.Value), StringComparer.Ordinal),
        _ => element.GetRawText()
    };

    private string? AttributeValue(string name) => AdditionalAttributes?.TryGetValue(name, out var value) == true ? Convert.ToString(value, CultureInfo.InvariantCulture) : null;
    private static bool UsesChangeEvent(string? tag, string? inputType) => string.Equals(tag, "select", StringComparison.OrdinalIgnoreCase) || string.Equals(inputType, "checkbox", StringComparison.OrdinalIgnoreCase) || string.Equals(inputType, "radio", StringComparison.OrdinalIgnoreCase);
    private static string NormalizeEvent(string? value) => string.IsNullOrWhiteSpace(value) ? "gardener:change" : value.StartsWith("gardener:", StringComparison.Ordinal) ? value : $"gardener:{value}";
    private static IEnumerable<string> Tokens(string? value) => (value ?? string.Empty).Split([' ', ','], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    private static void AddTokens(List<string> target, string? value) => target.AddRange(Tokens(value));
    private static void Add(RenderTreeBuilder builder, ref int sequence, string name, string? value)
    {
        if (!string.IsNullOrWhiteSpace(value)) builder.AddAttribute(sequence++, name, value);
    }
    private static string DataAttributeName(string value)
    {
        var normalized = ToKebab(value);
        return normalized.StartsWith("data-g-", StringComparison.Ordinal) ? normalized : normalized.StartsWith("g-", StringComparison.Ordinal) ? $"data-{normalized}" : $"data-g-{normalized}";
    }
    private static string? FormatConfigValue(object? value)
    {
        if (value is null) return null;
        if (value is string text) return text;
        if (value is JsonElement json) return json.ValueKind is JsonValueKind.Object or JsonValueKind.Array ? json.GetRawText() : json.ToString();
        if (value is IFormattable formattable) return formattable.ToString(null, CultureInfo.InvariantCulture);
        try { return JsonSerializer.Serialize(value); } catch (NotSupportedException) { return Convert.ToString(value, CultureInfo.InvariantCulture); }
    }
    private static string ToKebab(string value) => string.Concat(value.Select((character, index) => char.IsUpper(character) && index > 0 ? $"-{char.ToLowerInvariant(character)}" : char.ToLowerInvariant(character).ToString())).Replace('_', '-');
    private static readonly IReadOnlyDictionary<string, object?> EmptyConfig = new Dictionary<string, object?>();

    public async ValueTask DisposeAsync()
    {
        if (_mounted)
        {
            try
            {
                await Runtime.UnmountAsync(Element);
            }
            catch (JSDisconnectedException)
            {
            }
            catch (TaskCanceledException)
            {
            }
        }
        _receiver?.Dispose();
        GC.SuppressFinalize(this);
    }
}
