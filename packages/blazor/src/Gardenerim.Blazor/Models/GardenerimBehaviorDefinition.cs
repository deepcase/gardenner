namespace Gardenerim.Blazor.Models;

/// <summary>A Gardenerim DOM behavior and its callable instance members.</summary>
public sealed record GardenerimBehaviorDefinition(string Name, string Attribute, IReadOnlyList<string> InstanceMembers);
