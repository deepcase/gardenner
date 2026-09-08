namespace Gardenerim.Blazor.Models;

/// <summary>Shared data contract for the 41 navigation components. Omitted options use CSS runtime defaults.</summary>
public sealed class GardenerimNavigationItem
{
    public string Id { get; set; } = "";
    public string Label { get; set; } = "";
    public string? Href { get; set; }
    public string? Target { get; set; }
    public string? Icon { get; set; }
    public string? Description { get; set; }
    public object? Badge { get; set; }
    public string? Shortcut { get; set; }
    public string? Group { get; set; }
    public bool Disabled { get; set; }
    public bool Hidden { get; set; }
    public bool? Checked { get; set; }
    public bool Checkable { get; set; }
    public bool Closable { get; set; }
    public string? Status { get; set; }
    public string? Content { get; set; }
    public IReadOnlyList<GardenerimNavigationItem>? Children { get; set; }
}

public sealed class GardenerimNavigationOptions
{
    public IReadOnlyList<GardenerimNavigationItem> Items { get; set; } = [];
    public IReadOnlyList<GardenerimNavigationItem>? Actions { get; set; }
    public object? Value { get; set; }
    public object? DefaultValue { get; set; }
    public string? Label { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Brand { get; set; }
    public string? Orientation { get; set; }
    public string? Size { get; set; }
    public string? Appearance { get; set; }
    public object? Variant { get; set; }
    public object? State { get; set; }
    public bool? Disabled { get; set; }
    public bool? Loading { get; set; }
    public string? Activation { get; set; }
    public bool? Loop { get; set; }
    public bool? Open { get; set; }
    public bool? DefaultOpen { get; set; }
    public bool? Collapsed { get; set; }
    public IReadOnlyList<string>? ExpandedKeys { get; set; }
    public IReadOnlyList<string>? DefaultExpandedKeys { get; set; }
    public bool? CloseOnSelect { get; set; }
    public bool? Searchable { get; set; }
    public string? SearchPlaceholder { get; set; }
    public string? EmptyText { get; set; }
    public int? MaxVisibleItems { get; set; }
    public int? Total { get; set; }
    public int? PageSize { get; set; }
    public IReadOnlyList<int>? PageSizes { get; set; }
    public int? SiblingCount { get; set; }
    public bool? ShowTotal { get; set; }
    public bool? ShowSizeChanger { get; set; }
    public bool? ShowJumper { get; set; }
    public bool? HasPrevious { get; set; }
    public bool? HasNext { get; set; }
    public GardenerimNavigationItem? Previous { get; set; }
    public GardenerimNavigationItem? Next { get; set; }
    public string? BackHref { get; set; }
    public int? Threshold { get; set; }
    public int? ScrollOffset { get; set; }
    public string? ScrollTarget { get; set; }
    public bool? Sticky { get; set; }
    public bool? Fixed { get; set; }
    public bool? ShowIcons { get; set; }
    public bool? ShowBadges { get; set; }
    public bool? ShowDescriptions { get; set; }
    public bool? ShowShortcuts { get; set; }
    public bool? ShowGroups { get; set; }
    public bool? ShowHeader { get; set; }
    public bool? ShowActions { get; set; }
    public bool? ShowPanel { get; set; }
    public bool? Bordered { get; set; }
    public int? MaxHeight { get; set; }
    public int? PopupWidth { get; set; }
    public int? PopupMaxHeight { get; set; }
    public int? ItemGap { get; set; }
    public int? Indent { get; set; }
    public int? SelectionTimeout { get; set; }
    public bool? CloseOnEscape { get; set; }
    public bool? CloseOnOutside { get; set; }
}
