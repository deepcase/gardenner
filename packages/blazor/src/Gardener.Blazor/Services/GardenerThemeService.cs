using Gardener.Blazor.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Gardener.Blazor.Services;

/// <summary>Reads, applies, and clears the ten Gardener theme axes.</summary>
public sealed class GardenerThemeService(GardenerJsModule module)
{
    public async ValueTask ApplyAsync(ElementReference element, GardenerThemeState state, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("applyTheme", cancellationToken, element, state);

    public async ValueTask<GardenerThemeState> ReadAsync(ElementReference element, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeAsync<GardenerThemeState>("readTheme", cancellationToken, element);

    public async ValueTask ClearAsync(ElementReference element, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("clearTheme", cancellationToken, element);
}
