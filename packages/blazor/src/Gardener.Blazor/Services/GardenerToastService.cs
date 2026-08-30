using Microsoft.JSInterop;

namespace Gardener.Blazor.Services;

/// <summary>Creates Gardener toast notifications through the shared DOM runtime.</summary>
public sealed class GardenerToastService(GardenerJsModule module)
{
    public async ValueTask ShowAsync(string message, string? title = null, string? tone = null, int? timeout = null, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("showToast", cancellationToken, new { message, title, tone, timeout });
}
