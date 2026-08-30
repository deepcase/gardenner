namespace Gardener.Blazor.Models;

/// <summary>Global Gardener Blazor runtime options.</summary>
public sealed class GardenerOptions
{
    public string JavaScriptModulePath { get; set; } = GardenerConstants.JavaScriptModule;
}
