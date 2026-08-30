using Gardener.Blazor.Generated;
using Gardener.Blazor.Models;
using Microsoft.AspNetCore.Components;

namespace Gardener.Blazor.Components;

/// <summary>Renders any catalog component by its stable CSS component name.</summary>
public sealed class GardenerComponent : GardenerComponentBase
{
    [Parameter, EditorRequired] public string Name { get; set; } = string.Empty;

    protected override GardenerComponentDefinition Definition => GardenerCatalog.ByName.TryGetValue(Name, out var definition)
        ? definition
        : throw new InvalidOperationException($"Unknown Gardener component: {Name}");
}
