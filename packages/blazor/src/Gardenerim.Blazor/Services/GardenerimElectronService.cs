using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Gardenerim.Blazor.Services;

/// <summary>Binds Gardenerim window controls to an allow-listed Electron preload bridge.</summary>
public sealed class GardenerimElectronService(GardenerimJsModule module)
{
    public async ValueTask<bool> BindAsync(ElementReference root, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeAsync<bool>("bindElectron", cancellationToken, root);

    public async ValueTask UnbindAsync(ElementReference root, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("unbindElectron", cancellationToken, root);
}
