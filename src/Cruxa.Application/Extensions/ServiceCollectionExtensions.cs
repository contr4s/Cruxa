using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mapster;
using Cruxa.Application.Features.Auth.Handlers;
using Cruxa.Application.Common.Behaviors;
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
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        // FluentValidation
        services.AddValidatorsFromAssemblyContaining<RegisterHandler>();

        // Mapster
        TypeAdapterConfig.GlobalSettings.Default.MapToConstructor(true);

        return services;
    }
}
