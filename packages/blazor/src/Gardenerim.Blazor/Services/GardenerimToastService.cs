using Microsoft.JSInterop;
using Gardenerim.Blazor.Models;

namespace Gardenerim.Blazor.Services;

/// <summary>Creates Gardenerim toast notifications through the shared DOM runtime.</summary>
public sealed class GardenerimToastService(GardenerimJsModule module)
{
    public async ValueTask ShowAsync(string message, string? title = null, string? tone = null, int? timeout = null, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("showToast", cancellationToken, new { message, title, tone, timeout });

    public async ValueTask ShowAsync(GardenerimToastOptions options, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("showToast", cancellationToken, options);

    public async ValueTask ConfigureAsync(GardenerimToastConfiguration options, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("configureToast", cancellationToken, options);

    public async ValueTask ClearAsync(string? position = null, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("clearToasts", cancellationToken, position);
}
