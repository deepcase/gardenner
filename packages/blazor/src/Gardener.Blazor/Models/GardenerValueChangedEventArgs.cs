using System.Text.Json;

namespace Gardener.Blazor.Models;

/// <summary>A normalized native or <c>gardener:*</c> value change.</summary>
public sealed record GardenerValueChangedEventArgs(object? Value, string EventName, JsonElement? Detail = null);
