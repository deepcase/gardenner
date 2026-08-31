using Gardenerim.Blazor.Models;
using Microsoft.AspNetCore.Components;

namespace Gardenerim.Blazor.Components;

/// <summary>Attaches one Gardenerim behavior to an arbitrary wrapper element.</summary>
public sealed class GardenerimBehavior : GardenerimComponentBase
{
    private static readonly GardenerimComponentDefinition Wrapper = new("behavior", nameof(GardenerimBehavior), "runtime", "hybrid", "[data-g-*]", null, null, "div", "runtime-ready", [], [], [], [], ["web", "mobile", "desktop"], null);

    [Parameter, EditorRequired] public string Behavior { get; set; } = string.Empty;
    [Parameter] public IReadOnlyList<string>? Behaviors { get; set; }
    protected override GardenerimComponentDefinition Definition => Wrapper;
    protected override IReadOnlyList<string> RuntimeBehaviors => Tokens().Distinct(StringComparer.Ordinal).ToArray();

    private IEnumerable<string> Tokens() => Behavior.Split([' ', ','], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).Concat(Behaviors ?? []);
}
