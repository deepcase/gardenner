namespace Gardenerim.Blazor.Models;

/// <summary>Data-driven GTable contract. Use OnEvent for selection, paging, sorting and editing.</summary>
public sealed class GardenerimTableOptions
{
    public required IReadOnlyList<GardenerimTableColumn> Columns { get; set; }
    public IReadOnlyList<IReadOnlyDictionary<string, object?>> Data { get; set; } = [];
    public string RowKey { get; set; } = "key";
    public string? Caption { get; set; }
    public string? AriaLabel { get; set; }
    public string Size { get; set; } = "large";
    public object Bordered { get; set; } = true;
    public bool Stripe { get; set; }
    public bool Hoverable { get; set; } = true;
    public bool TableLayoutFixed { get; set; }
    public bool ShowHeader { get; set; } = true;
    public bool Disabled { get; set; }
    public bool Loading { get; set; }
    public object? RowSelection { get; set; }
    public object? Expandable { get; set; }
    public IReadOnlyList<object>? SelectedKeys { get; set; }
    public IReadOnlyList<object>? DefaultSelectedKeys { get; set; }
    public IReadOnlyList<object>? ExpandedKeys { get; set; }
    public IReadOnlyList<object>? DefaultExpandedKeys { get; set; }
    public bool DefaultExpandAllRows { get; set; }
    public int IndentSize { get; set; } = 16;
    public object Pagination { get; set; } = new GardenerimTablePagination();
    public string PagePosition { get; set; } = "br";
    public GardenerimTableScroll? Scroll { get; set; }
    public object? StickyHeader { get; set; }
    public object? VirtualListProps { get; set; }
    public object? Sorter { get; set; }
    public object? Filters { get; set; }
    public bool Summary { get; set; }
    public string? SummaryText { get; set; }
    public bool ColumnResizable { get; set; }
    public object? Draggable { get; set; }
    public string Mode { get; set; } = "client";
    public int? Total { get; set; }
    public IReadOnlyDictionary<string,string>? Labels { get; set; }
}
public sealed class GardenerimTableColumn
{
    public string? DataIndex { get; set; }
    public string? Title { get; set; }
    public IReadOnlyList<GardenerimTableColumn>? Children { get; set; }
    public string? Type { get; set; }
    public int? Width { get; set; }
    public int? MinWidth { get; set; }
    public int? MaxWidth { get; set; }
    public string? Align { get; set; }
    public string? Fixed { get; set; }
    public bool Ellipsis { get; set; }
    public bool Tooltip { get; set; } = true;
    public bool Editable { get; set; }
    public bool Resizable { get; set; } = true;
    public object? Sortable { get; set; }
    public object? Filterable { get; set; }
    public int? RowSpan { get; set; }
    public int? ColSpan { get; set; }
    public string? CellClass { get; set; }
}
public sealed class GardenerimTablePagination
{
    public int? Current { get; set; }
    public int? PageSize { get; set; }
    public int DefaultCurrent { get; set; } = 1;
    public int DefaultPageSize { get; set; } = 10;
    public bool ShowPageSize { get; set; } = true;
    public IReadOnlyList<int> PageSizeOptions { get; set; } = [10,20,50,100];
}
public sealed class GardenerimTableScroll
{
    public object? X { get; set; }
    public object? Y { get; set; }
    public object? MinWidth { get; set; }
    public object? MaxHeight { get; set; }
}
