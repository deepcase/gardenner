using Gardener.Blazor.Models;
using Microsoft.AspNetCore.Components;

namespace Gardener.Blazor.Components;

/// <summary>Attaches one Gardener behavior to an arbitrary wrapper element.</summary>
public sealed class GardenerBehavior : GardenerComponentBase
{
    private static readonly GardenerComponentDefinition Wrapper = new("behavior", nameof(GardenerBehavior), "runtime", "hybrid", "[data-g-*]", null, null, "div", "runtime-ready", [], [], [], [], ["web", "mobile", "desktop"], null);

    [Parameter, EditorRequired] public string Behavior { get; set; } = string.Empty;
    [Parameter] public IReadOnlyList<string>? Behaviors { get; set; }
    protected override GardenerComponentDefinition Definition => Wrapper;
    protected override IReadOnlyList<string> RuntimeBehaviors => Tokens().Distinct(StringComparer.Ordinal).ToArray();

    private IEnumerable<string> Tokens() => Behavior.Split([' ', ','], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).Concat(Behaviors ?? []);
}
