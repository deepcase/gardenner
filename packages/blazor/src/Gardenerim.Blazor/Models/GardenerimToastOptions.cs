namespace Gardenerim.Blazor.Models;

/// <summary>Options for a Gardenerim global toast message.</summary>
public sealed record GardenerimToastOptions
{
    public string Message { get; init; } = string.Empty;
    public string? Title { get; init; }
    public string? Tone { get; init; }
    public int? Timeout { get; init; }
    public string? Id { get; init; }
    public string? Position { get; init; }
    public bool? Closable { get; init; }
    public bool? ShowIcon { get; init; }
    public bool? Persistent { get; init; }
    public bool? Compact { get; init; }
    public bool? Spacious { get; init; }
    public string? ActionLabel { get; init; }
    public bool? ActionClose { get; init; }
    public int? MaxCount { get; init; }
}

/// <summary>Global defaults shared by subsequent toast messages.</summary>
public sealed record GardenerimToastConfiguration
{
    public int? Timeout { get; init; }
    public int? MaxCount { get; init; }
    public string? Position { get; init; }
    public bool? Closable { get; init; }
    public bool? ShowIcon { get; init; }
}
