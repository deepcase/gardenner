namespace Gardener.Blazor.Models;

/// <summary>Accessibility contract declared by a Gardener component.</summary>
public sealed record GardenerAccessibilityDefinition(
    IReadOnlyList<string> Roles,
    IReadOnlyList<string> Keyboard,
    bool FocusTrap,
    IReadOnlyList<string> Attributes);

