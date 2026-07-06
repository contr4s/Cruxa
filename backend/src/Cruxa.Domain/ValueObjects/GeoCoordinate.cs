namespace Cruxa.Domain.ValueObjects;

using Common;

/// <summary>
/// Geographic coordinate (latitude/longitude)
/// </summary>
public sealed record GeoCoordinate
{
    private const double EarthRadiusKm = 6371.0;

    public double Latitude { get; }
    public double Longitude { get; }

    private GeoCoordinate(double latitude, double longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
    }

    public static Result<GeoCoordinate> Create(double latitude, double longitude)
    {
        if (latitude is < -90.0 or > 90.0)
            return Error.Validation("Latitude must be between -90 and 90");
        if (longitude is < -180.0 or > 180.0)
            return Error.Validation("Longitude must be between -180 and 180");

        return Result.Success(new GeoCoordinate(latitude, longitude));
    }

    /// <summary>
    /// Calculate distance to another coordinate using Haversine formula
    /// </summary>
    public double DistanceTo(GeoCoordinate other)
    {
        var lat1 = ToRadians(Latitude);
        var lon1 = ToRadians(Longitude);
        var lat2 = ToRadians(other.Latitude);
        var lon2 = ToRadians(other.Longitude);

        var dlat = lat2 - lat1;
        var dlon = lon2 - lon1;

        var a = Math.Pow(Math.Sin(dlat / 2), 2) +
                Math.Cos(lat1) * Math.Cos(lat2) *
                Math.Pow(Math.Sin(dlon / 2), 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return EarthRadiusKm * c;
    }

    private static double ToRadians(double degrees) => degrees * Math.PI / 180.0;
}
