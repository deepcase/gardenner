namespace Gardenerim.Blazor.Models;

/// <summary>Accessibility contract declared by a Gardenerim component.</summary>
public sealed record GardenerimAccessibilityDefinition(
    IReadOnlyList<string> Roles,
    IReadOnlyList<string> Keyboard,
    bool FocusTrap,
    IReadOnlyList<string> Attributes);
