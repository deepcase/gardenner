namespace Gardener.Blazor.Models;

/// <summary>A Gardener DOM behavior and its callable instance members.</summary>
public sealed record GardenerBehaviorDefinition(string Name, string Attribute, IReadOnlyList<string> InstanceMembers);

