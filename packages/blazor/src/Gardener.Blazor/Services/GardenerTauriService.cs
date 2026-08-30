using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Gardener.Blazor.Services;

/// <summary>Binds Gardener window controls to an allow-listed Tauri bridge.</summary>
public sealed class GardenerTauriService(GardenerJsModule module)
{
    public async ValueTask<bool> BindAsync(ElementReference root, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeAsync<bool>("bindTauri", cancellationToken, root);

    public async ValueTask UnbindAsync(ElementReference root, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("unbindTauri", cancellationToken, root);
}
