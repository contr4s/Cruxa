using Cruxa.Application.Interfaces;

namespace Cruxa.Infrastructure.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence;
using Repositories;
using Security;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<CruxaDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection") ??
                throw new InvalidOperationException("Connection string 'DefaultConnection' not found."),
                b => b.MigrationsAssembly(typeof(CruxaDbContext).Assembly.FullName)));

        // Регистрация репозиториев
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IGymRepository, GymRepository>();
        services.AddScoped<IRouteRepository, RouteRepository>();
        services.AddScoped<IGradingSystemRepository, GradingSystemRepository>();
        services.AddScoped<IPostRepository, PostRepository>();
        services.AddScoped<IAscentRepository, AscentRepository>();
        services.AddScoped<ILikeRepository, LikeRepository>();
        services.AddScoped<ICommentRepository, CommentRepository>();
        services.AddScoped<IFollowerRepository, FollowerRepository>();

        // JWT Token Generator
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        return services;
    }
}
