namespace Gardener.Blazor.Models;

/// <summary>A Gardener custom event contract.</summary>
public sealed record GardenerEventDefinition(
    string Name,
    IReadOnlyList<string> DetailKeys,
    bool Guard,
    bool Bubbles,
    bool Cancelable);

