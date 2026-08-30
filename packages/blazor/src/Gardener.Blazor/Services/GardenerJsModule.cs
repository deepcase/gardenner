using Gardener.Blazor.Models;
using Microsoft.Extensions.Options;
using Microsoft.JSInterop;

namespace Gardener.Blazor.Services;

/// <summary>Owns the scoped JavaScript module reference used by Gardener services.</summary>
public sealed class GardenerJsModule(IJSRuntime js, IOptions<GardenerOptions> options) : IAsyncDisposable
{
    private readonly SemaphoreSlim _gate = new(1, 1);
    private IJSObjectReference? _module;

    public async ValueTask<IJSObjectReference> GetAsync()
    {
        if (_module is not null) return _module;
        await _gate.WaitAsync().ConfigureAwait(false);
        try
        {
            _module ??= await js.InvokeAsync<IJSObjectReference>("import", options.Value.JavaScriptModulePath).ConfigureAwait(false);
            return _module;
        }
        finally
        {
            _gate.Release();
        }
    }

    public async ValueTask DisposeAsync()
    {
        try
        {
            if (_module is not null) await _module.DisposeAsync().ConfigureAwait(false);
        }
        catch (JSDisconnectedException)
        {
        }
        catch (TaskCanceledException)
        {
        }
        _gate.Dispose();
        GC.SuppressFinalize(this);
    }
}
