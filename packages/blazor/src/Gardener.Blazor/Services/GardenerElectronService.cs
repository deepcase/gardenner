using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Gardener.Blazor.Services;

/// <summary>Binds Gardener window controls to an allow-listed Electron preload bridge.</summary>
public sealed class GardenerElectronService(GardenerJsModule module)
{
    public async ValueTask<bool> BindAsync(ElementReference root, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeAsync<bool>("bindElectron", cancellationToken, root);

    public async ValueTask UnbindAsync(ElementReference root, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("unbindElectron", cancellationToken, root);
}
