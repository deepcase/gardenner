namespace Gardenerim.Blazor.Models;

/// <summary>A Gardenerim custom event contract.</summary>
public sealed record GardenerimEventDefinition(
    string Name,
    IReadOnlyList<string> DetailKeys,
    bool Guard,
    bool Bubbles,
    bool Cancelable);
