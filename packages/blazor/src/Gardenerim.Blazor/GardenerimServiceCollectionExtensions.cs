using Gardenerim.Blazor.Models;
using Gardenerim.Blazor.Services;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Microsoft.Extensions.DependencyInjection;

/// <summary>Gardenerim Blazor dependency injection registration.</summary>
public static class GardenerimServiceCollectionExtensions
{
    public static IServiceCollection AddGardenerimBlazor(this IServiceCollection services, Action<GardenerimOptions>? configure = null)
    {
        ArgumentNullException.ThrowIfNull(services);
        if (configure is not null)
        {
            services.Configure(configure);
        }
        else
        {
            services.AddOptions<GardenerimOptions>();
        }

        services.TryAddScoped<GardenerimJsModule>();
        services.TryAddScoped<GardenerimRuntime>();
        services.TryAddScoped<GardenerimThemeService>();
        services.TryAddScoped<GardenerimToastService>();
        services.TryAddScoped<GardenerimTauriService>();
        services.TryAddScoped<GardenerimElectronService>();
        return services;
    }
}
