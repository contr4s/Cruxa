using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mapster;
using Cruxa.Application.Features.Auth.Handlers;
using Cruxa.Application.Common.Behaviors;
using Cruxa.Domain.Entities;
using Cruxa.Domain.ValueObjects;
using Cruxa.Application.Features.Gyms.DTOs;
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
            .Map(dest => dest.Longitude, src => src.Location != null ? src.Location.Longitude : (double?)null);

        return services;
    }
}
