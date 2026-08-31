using Gardenerim.Blazor.Generated;
using Gardenerim.Blazor.Models;
using Microsoft.AspNetCore.Components;

namespace Gardenerim.Blazor.Components;

/// <summary>Renders any catalog component by its stable CSS component name.</summary>
public sealed class GardenerimComponent : GardenerimComponentBase
{
    [Parameter, EditorRequired] public string Name { get; set; } = string.Empty;

    protected override GardenerimComponentDefinition Definition => GardenerimCatalog.ByName.TryGetValue(Name, out var definition)
        ? definition
        : throw new InvalidOperationException($"Unknown Gardenerim component: {Name}");
}
