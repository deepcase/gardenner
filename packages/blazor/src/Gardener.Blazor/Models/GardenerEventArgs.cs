namespace Gardener.Blazor.Models;

/// <summary>A serializable <c>gardener:*</c> event received from the DOM runtime.</summary>
public sealed record GardenerEventArgs(object? Detail, string EventName, bool DefaultPrevented);

