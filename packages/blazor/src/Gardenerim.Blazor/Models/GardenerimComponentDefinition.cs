namespace Gardenerim.Blazor.Models;

/// <summary>Machine-generated mapping between a Razor component and its Gardenerim CSS contract.</summary>
public sealed record GardenerimComponentDefinition(
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
    GardenerimAccessibilityDefinition? Accessibility);
