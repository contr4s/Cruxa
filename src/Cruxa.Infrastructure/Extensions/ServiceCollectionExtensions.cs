using Cruxa.Domain.Common;

namespace Cruxa.Infrastructure.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence;
using Security;
using Features.Users.Repositories;
using Features.Gyms.Repositories;
using Features.Routes.Repositories;
using Features.GradingSystems;
using Features.Posts.Repositories;
using Features.Ascents.Repositories;
using Features.Social;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Application.Features.Gyms.Interfaces;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.GradingSystems.Interfaces;
using Cruxa.Application.Features.Posts.Interfaces;
using Cruxa.Application.Features.Ascents.Interfaces;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Common.Interfaces;

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
