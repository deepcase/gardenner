using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Rendering;

namespace Gardener.Blazor.Components;

/// <summary>A validation-aware, strongly typed Gardener input/select/textarea for <see cref="EditForm"/>.</summary>
public sealed class GardenerField<TValue> : InputBase<TValue>
{
    [Parameter] public string As { get; set; } = "input";
    [Parameter] public string? Type { get; set; }
    [Parameter] public string? Class { get; set; }
    [Parameter] public string? Variant { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }
    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        var tag = As.ToLowerInvariant() is "select" or "textarea" ? As.ToLowerInvariant() : "input";
        var rootClass = tag switch { "select" => "g-select", "textarea" => "g-textarea", _ => "g-input" };
        var classes = string.Join(' ', new[] { rootClass, Variant is null ? null : $"{rootClass}-{Variant}", CssClass, Class }.Where(static item => !string.IsNullOrWhiteSpace(item)));
        builder.OpenElement(0, tag);
        builder.AddMultipleAttributes(1, AdditionalAttributes);
        if (tag == "input") builder.AddAttribute(2, "type", Type ?? "text");
        builder.AddAttribute(3, "class", classes);
        builder.AddAttribute(4, "name", NameAttributeValue);
        if (tag == "input" && string.Equals(Type, "checkbox", StringComparison.OrdinalIgnoreCase))
        {
            var current = CurrentValue is bool value && value;
            builder.AddAttribute(5, "checked", current);
            builder.AddAttribute(6, "onchange", EventCallback.Factory.CreateBinder<bool>(this, value => CurrentValueAsString = value.ToString(), current));
        }
        else
        {
            builder.AddAttribute(5, "value", CurrentValueAsString);
            builder.AddAttribute(6, tag == "input" ? "oninput" : "onchange", EventCallback.Factory.CreateBinder<string?>(this, value => CurrentValueAsString = value, CurrentValueAsString));
        }
        builder.AddContent(7, ChildContent);
        builder.CloseElement();
    }

    protected override bool TryParseValueFromString(string? value, [MaybeNullWhen(false)] out TValue result, [NotNullWhen(false)] out string? validationErrorMessage)
    {
        if (BindConverter.TryConvertTo<TValue>(value, CultureInfo.CurrentCulture, out var converted))
        {
            result = converted;
            validationErrorMessage = null;
            return true;
        }

        result = default;
        validationErrorMessage = $"The {FieldIdentifier.FieldName} field is not valid.";
        return false;
    }
}
