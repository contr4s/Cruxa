using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mapster;
using Cruxa.Application.Features.Auth.Handlers;
using Cruxa.Application.Common.Behaviors;
using Cruxa.Domain.Entities;
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

        return services;
    }
}
