namespace Gardener.Blazor.Models;

/// <summary>Machine-generated mapping between a Razor component and its Gardener CSS contract.</summary>
public sealed record GardenerComponentDefinition(
    string Name,
    string ComponentType,
    string Category,
    string Kind,
    string Selector,
    string? CssSelector,
    string? ClassName,
    string DefaultTag,
    string? Status,
    IReadOnlyList<string> Variants,
    IReadOnlyList<string> States,
    IReadOnlyList<string> Parts,
    IReadOnlyList<string> Behaviors,
    IReadOnlyList<string> Platforms,
    GardenerAccessibilityDefinition? Accessibility);
