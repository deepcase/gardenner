namespace Gardenerim.Blazor.Models;

/// <summary>A serializable <c>gardener:*</c> event received from the DOM runtime.</summary>
public sealed record GardenerimEventArgs(object? Detail, string EventName, bool DefaultPrevented);
