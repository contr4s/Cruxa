using Cruxa.Infrastructure.Repositories;

namespace Cruxa.Infrastructure.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using Persistence;
using Security;
using Application.Features.Users.Interfaces;
using Application.Features.Gyms.Interfaces;
using Application.Features.Routes.Interfaces;
using Application.Features.GradingSystems.Interfaces;
using Application.Features.Posts.Interfaces;
using Application.Features.Ascents.Interfaces;
using Application.Features.Social.Interfaces;
using Application.Common.Interfaces;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
        dataSourceBuilder.EnableDynamicJson();
        var dataSource = dataSourceBuilder.Build();

        services.AddDbContext<CruxaDbContext>(options =>
            options.UseNpgsql(dataSource,
                b => b.MigrationsAssembly(typeof(CruxaDbContext).Assembly.FullName)));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IGymRepository, GymRepository>();
        services.AddScoped<IRouteRepository, RouteRepository>();
        services.AddScoped<ITagRepository, TagRepository>();
        services.AddScoped<IGradingSystemRepository, GradingSystemRepository>();
        services.AddScoped<IPostRepository, PostRepository>();
        services.AddScoped<IAscentRepository, AscentRepository>();
        services.AddScoped<ILikeRepository, LikeRepository>();
        services.AddScoped<ICommentRepository, CommentRepository>();
        services.AddScoped<IFollowerRepository, FollowerRepository>();
        services.AddScoped<IRouteReviewRepository, RouteReviewRepository>();
        services.AddScoped<IPasswordCredentialRepository, PasswordCredentialRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

        // Transaction manager
        services.AddScoped<ITransactionManager, TransactionManager>();

        // JWT Token Generator
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        // Password hasher
        services.AddScoped<IPasswordHasher, PasswordHasher>();

        return services;
    }
}
