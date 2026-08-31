using Gardenerim.Blazor.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Gardenerim.Blazor.Services;

/// <summary>Scoped access to Gardenerim's DOM runtime.</summary>
public sealed class GardenerimRuntime(GardenerimJsModule module)
{
    public async ValueTask InitializeAsync(ElementReference element, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("initialize", cancellationToken, element);

    public async ValueTask DestroyAsync(ElementReference element, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("destroy", cancellationToken, element);

    public async ValueTask RefreshAsync(ElementReference element, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("refresh", cancellationToken, element);

    public async ValueTask<bool> EmitAsync(ElementReference element, string eventName, object? detail = null, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeAsync<bool>("emit", cancellationToken, element, eventName, detail);

    public async ValueTask FocusAsync(ElementReference element, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("focus", cancellationToken, element);

    public async ValueTask<IReadOnlyList<string>> GetBehaviorMembersAsync(ElementReference element, string behavior, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeAsync<string[]>("getBehaviorMembers", cancellationToken, element, behavior);

    public async ValueTask<T?> InvokeBehaviorAsync<T>(ElementReference element, string behavior, string member, object?[]? arguments = null, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeAsync<T?>("invokeBehavior", cancellationToken, element, behavior, member, arguments ?? []);

    internal async ValueTask MountAsync(ElementReference element, bool initialize, string valueEvent, string valueKey, bool listenForValue, IReadOnlyList<string> eventNames, IReadOnlyList<string> preventDefaultEvents, object? receiver, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("mount", cancellationToken, element, initialize, valueEvent, valueKey, listenForValue, eventNames, preventDefaultEvents, receiver);

    internal async ValueTask UnmountAsync(ElementReference element, CancellationToken cancellationToken = default) =>
        await (await module.GetAsync()).InvokeVoidAsync("unmount", cancellationToken, element);
}
