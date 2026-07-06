using System.Text.Json;
using System.Text.Json.Serialization;

namespace Cruxa.Domain.Common;

/// <summary>
/// Serializes TimeOnly as "HH:mm" (e.g. "8:00", "23:30").
/// </summary>
public class TimeOnlyJsonConverter : JsonConverter<TimeOnly>
{
    private const string Format = "H:mm";

    public override TimeOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        return string.IsNullOrEmpty(value) ? default : TimeOnly.Parse(value);
    }

    public override void Write(Utf8JsonWriter writer, TimeOnly value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(Format));
    }
}
