using Gardenerim.Blazor.Models;
using Gardenerim.Blazor.Services;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.JSInterop;

namespace Gardenerim.Blazor.Components;

/// <summary>Defines a ten-axis theme scope and initializes its Gardenerim subtree.</summary>
public sealed class GardenerimProvider : ComponentBase, IAsyncDisposable
{
    private bool _mounted;
    private string? _mountedSignature;
    [Inject] private GardenerimRuntime Runtime { get; set; } = default!;

    [Parameter] public string As { get; set; } = "div";
    [Parameter] public string? Theme { get; set; } = "garden";
    [Parameter] public string? Mode { get; set; } = "light";
    [Parameter] public string? Neutral { get; set; }
    [Parameter] public string? Typography { get; set; }
    [Parameter] public string? Shape { get; set; } = "small";
    [Parameter] public string? Density { get; set; }
    [Parameter] public string? Elevation { get; set; }
    [Parameter] public string? Motion { get; set; }
    [Parameter] public string? Platform { get; set; }
    [Parameter] public string? Os { get; set; }
    [Parameter] public string? Class { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter(CaptureUnmatchedValues = true)] public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
    public ElementReference Element { get; private set; }

    public GardenerimThemeState State => new() { Theme = Theme, Mode = Mode, Neutral = Neutral, Typography = Typography, Shape = Shape, Density = Density, Elevation = Elevation, Motion = Motion, Platform = Platform, Os = Os };

    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        var sequence = 0;
        builder.OpenElement(sequence++, As);
        builder.AddMultipleAttributes(sequence++, AdditionalAttributes);
        var additionalClass = AdditionalAttributes?.TryGetValue("class", out var attributeClass) == true ? Convert.ToString(attributeClass) : null;
        Add(builder, ref sequence, "class", string.Join(' ', new[] { additionalClass, Class }.Where(static item => !string.IsNullOrWhiteSpace(item))));
        foreach (var (axis, value) in Axes()) Add(builder, ref sequence, $"data-g-{axis}", value);
        builder.AddElementReferenceCapture(sequence++, reference => Element = reference);
        builder.AddContent(sequence++, ChildContent);
        builder.CloseElement();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        var signature = string.Join('|', Axes().Select(static item => $"{item.Axis}={item.Value}"));
        if (_mounted && string.Equals(signature, _mountedSignature, StringComparison.Ordinal)) return;
        try
        {
            if (_mounted) await Runtime.RefreshAsync(Element); else await Runtime.InitializeAsync(Element);
            _mounted = true;
            _mountedSignature = signature;
        }
        catch (InvalidOperationException)
        {
        }
        catch (JSDisconnectedException)
        {
        }
    }

    private IEnumerable<(string Axis, string? Value)> Axes()
    {
        yield return ("theme", Theme); yield return ("mode", Mode); yield return ("neutral", Neutral); yield return ("typography", Typography); yield return ("shape", Shape);
        yield return ("density", Density); yield return ("elevation", Elevation); yield return ("motion", Motion); yield return ("platform", Platform); yield return ("os", Os);
    }

    private static void Add(RenderTreeBuilder builder, ref int sequence, string name, string? value)
    {
        if (!string.IsNullOrWhiteSpace(value)) builder.AddAttribute(sequence++, name, value);
    }

    public async ValueTask DisposeAsync()
    {
        if (_mounted)
        {
            try { await Runtime.DestroyAsync(Element); } catch (JSDisconnectedException) { } catch (TaskCanceledException) { }
        }
        GC.SuppressFinalize(this);
    }
}
