using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace Gardener.Blazor.Components;

/// <summary>Creates a semantic internal part while preserving arbitrary attributes and content.</summary>
public sealed class GardenerPart : ComponentBase
{
    [Parameter] public string As { get; set; } = "div";
    [Parameter, EditorRequired] public string Class { get; set; } = string.Empty;
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter(CaptureUnmatchedValues = true)] public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        builder.OpenElement(0, As);
        builder.AddMultipleAttributes(1, AdditionalAttributes);
        var additionalClass = AdditionalAttributes?.TryGetValue("class", out var value) == true ? Convert.ToString(value) : null;
        builder.AddAttribute(2, "class", string.Join(' ', new[] { additionalClass, Class }.Where(static item => !string.IsNullOrWhiteSpace(item))));
        builder.AddContent(3, ChildContent);
        builder.CloseElement();
    }
}
