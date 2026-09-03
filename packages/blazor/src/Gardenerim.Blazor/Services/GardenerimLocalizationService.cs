using Gardenerim.Blazor.Models;
using Microsoft.JSInterop;

namespace Gardenerim.Blazor.Services;

/// <summary>Configures the shared Gardenerim runtime locale used by Blazor components.</summary>
public sealed class GardenerimLocalizationService(GardenerimJsModule module)
{
    public async ValueTask<GardenerimLocalizationState> ConfigureAsync(GardenerimLocalizationOptions options, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(options);
        return await (await module.GetAsync()).InvokeAsync<GardenerimLocalizationState>("configureLocalization", cancellationToken, options);
    }

    public async ValueTask<GardenerimLocalizationState> GetAsync(CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeAsync<GardenerimLocalizationState>("getLocalization", cancellationToken);
}
