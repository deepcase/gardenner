using Gardenerim.Blazor.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Gardenerim.Blazor.Services;

/// <summary>Reads, applies, and clears the ten Gardenerim theme axes.</summary>
public sealed class GardenerimThemeService(GardenerimJsModule module)
{
    public async ValueTask ApplyAsync(ElementReference element, GardenerimThemeState state, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("applyTheme", cancellationToken, element, state);

    public async ValueTask<GardenerimThemeState> ReadAsync(ElementReference element, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeAsync<GardenerimThemeState>("readTheme", cancellationToken, element);

    public async ValueTask ClearAsync(ElementReference element, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("clearTheme", cancellationToken, element);
}
