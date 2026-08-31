using System.Text.Json;

namespace Gardenerim.Blazor.Models;

/// <summary>A normalized native or <c>gardener:*</c> value change.</summary>
public sealed record GardenerimValueChangedEventArgs(object? Value, string EventName, JsonElement? Detail = null);
