using Cruxa.Infrastructure.Repositories;

namespace Cruxa.Infrastructure.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using Persistence;
using Security;
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

        // Transaction manager
        services.AddScoped<ITransactionManager, TransactionManager>();

        // JWT Token Generator
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        // Password hasher
        services.AddScoped<IPasswordHasher, PasswordHasher>();

        return services;
    }
}
