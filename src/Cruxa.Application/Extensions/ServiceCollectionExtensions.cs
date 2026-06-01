using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using Cruxa.Application.Mappings;
using Cruxa.Application.Interfaces;
using Cruxa.Application.Services;

namespace Cruxa.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
    {
        // AutoMapper
        services.AddAutoMapper(typeof(MappingProfile));

        // Services
        services.AddScoped<IGradeMappingService, GradeMappingService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IGymService, GymService>();
        services.AddScoped<IRouteService, RouteService>();
        services.AddScoped<IPostService, PostService>();
        services.AddScoped<IAscentService, AscentService>();

        return services;
    }
}
