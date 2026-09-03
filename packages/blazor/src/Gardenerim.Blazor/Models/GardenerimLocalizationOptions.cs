namespace Gardenerim.Blazor.Models;

/// <summary>Runtime locale and optional message overrides.</summary>
public sealed class GardenerimLocalizationOptions
{
    public string[]? Locale { get; set; }
    public IReadOnlyDictionary<string, string>? Messages { get; set; }
    public bool Refresh { get; set; } = true;
}

/// <summary>Resolved Gardenerim runtime localization state.</summary>
public sealed class GardenerimLocalizationState
{
    public string Locale { get; set; } = "en";
    public IReadOnlyDictionary<string, string> Messages { get; set; } = new Dictionary<string, string>();
    public IReadOnlyList<string> SupportedLocales { get; set; } = [];
}
