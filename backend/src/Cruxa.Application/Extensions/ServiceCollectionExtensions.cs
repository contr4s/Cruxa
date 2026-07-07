using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mapster;
using Cruxa.Application.Features.Auth.Handlers;
using Cruxa.Application.Common.Behaviors;
using Cruxa.Domain.Entities;
using Cruxa.Domain.ValueObjects;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Features.Users.DTOs;
using FluentValidation;

namespace Cruxa.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
    {
        // MediatR (CQRS)
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssemblyContaining<RegisterHandler>();
            cfg.AddOpenBehavior(typeof(TransactionBehavior<,>));
            cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        // FluentValidation
        services.AddValidatorsFromAssemblyContaining<RegisterHandler>();

        // Mapster
        TypeAdapterConfig.GlobalSettings.Default.MapToConstructor(true);

        // Tag entity ↔ string mapping for DTOs
        TypeAdapterConfig<Tag, string>.NewConfig()
            .MapWith(src => src.Value);
        TypeAdapterConfig<string, Tag>.NewConfig()
            .MapWith(src => Tag.CreateUnsafe(src));

        // Gym → GymDto: flatten GeoCoordinate.Location into Latitude/Longitude
        TypeAdapterConfig<Gym, GymDto>.NewConfig()
            .Map(dest => dest.Latitude, src => src.Location != null ? src.Location.Latitude : (double?)null)
            .Map(dest => dest.Longitude, src => src.Location != null ? src.Location.Longitude : (double?)null)
            .Map(dest => dest.Phone, src => src.ContactInfo)
            .Map(dest => dest.Email, src => src.ContactEmail)
            .Map(dest => dest.SocialLinks, src => src.SocialLinks)
            .Map(dest => dest.RouteCount, src => src.Routes.Count)
            .Map(dest => dest.ActiveRouteCount, src => src.Routes.Count(r => r.IsActive))
            .Map(dest => dest.WallArea, src => src.WallArea)
            .Map(dest => dest.MaxHeight, src => src.MaxHeight)
            .Map(dest => dest.YearFounded, src => src.YearFounded)
            .Map(dest => dest.MetroStations, src => src.MetroStations)
            .Map(dest => dest.Tags, src => src.Tags)
            .Map(dest => dest.PhotoUrls, src => src.PhotoUrls)
            .Map(dest => dest.Prices, src => src.Prices)
            .Map(dest => dest.WorkingHours, src => src.WorkingHours);

        // User → UserDto: flatten Email ValueObject and Role enum
        TypeAdapterConfig<User, UserDto>.NewConfig()
            .Map(dest => dest.Email, src => src.Email.Value)
            .Map(dest => dest.Role, src => src.Role.ToString());

        // Route → RouteDto: map navigation properties
        TypeAdapterConfig<Route, RouteDto>.NewConfig()
            .Map(dest => dest.Name, src => src.Name)
            .Map(dest => dest.GymName, src => src.Gym != null ? src.Gym.Name : "")
            .Map(dest => dest.SetterUsername, src => src.Author != null ? src.Author.Username : null)
            .Map(dest => dest.SetterAvatarUrl, src => src.Author != null ? src.Author.AvatarUrl : null)
            .Map(dest => dest.Rating, src => src.Reviews.Count > 0 ? src.Reviews.Average(r => r.Rating ?? 0) : 0)
            .Map(dest => dest.AscentsCount, src => src.Ascents.Count);

        return services;
    }
}
