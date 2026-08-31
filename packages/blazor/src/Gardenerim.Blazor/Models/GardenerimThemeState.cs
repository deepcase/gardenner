namespace Gardenerim.Blazor.Models;

/// <summary>The complete ten-axis Gardenerim theme state.</summary>
public sealed record GardenerimThemeState
{
    public string? Theme { get; init; }
    public string? Mode { get; init; }
    public string? Neutral { get; init; }
    public string? Typography { get; init; }
    public string? Shape { get; init; }
    public string? Density { get; init; }
    public string? Elevation { get; init; }
    public string? Motion { get; init; }
    public string? Platform { get; init; }
    public string? Os { get; init; }
}
