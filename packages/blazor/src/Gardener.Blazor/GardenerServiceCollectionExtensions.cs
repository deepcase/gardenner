using Gardener.Blazor.Models;
using Gardener.Blazor.Services;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Microsoft.Extensions.DependencyInjection;

/// <summary>Gardener Blazor dependency injection registration.</summary>
public static class GardenerServiceCollectionExtensions
{
    public static IServiceCollection AddGardenerBlazor(this IServiceCollection services, Action<GardenerOptions>? configure = null)
    {
        ArgumentNullException.ThrowIfNull(services);
        if (configure is not null)
        {
            services.Configure(configure);
        }
        else
        {
            services.AddOptions<GardenerOptions>();
        }

        services.TryAddScoped<GardenerJsModule>();
        services.TryAddScoped<GardenerRuntime>();
        services.TryAddScoped<GardenerThemeService>();
        services.TryAddScoped<GardenerToastService>();
        services.TryAddScoped<GardenerTauriService>();
        services.TryAddScoped<GardenerElectronService>();
        return services;
    }
}
