using Microsoft.JSInterop;

namespace Gardenerim.Blazor.Services;

/// <summary>Creates Gardenerim toast notifications through the shared DOM runtime.</summary>
public sealed class GardenerimToastService(GardenerimJsModule module)
{
    public async ValueTask ShowAsync(string message, string? title = null, string? tone = null, int? timeout = null, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("showToast", cancellationToken, new { message, title, tone, timeout });
}
