namespace Cruxa.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Domain.Entities;

public class CruxaDbContext : DbContext
{
    public static readonly Guid DefaultGradingSystemId = new("00000000-0000-0000-0000-000000000001");

    public CruxaDbContext(DbContextOptions<CruxaDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Gym> Gyms => Set<Gym>();
    public DbSet<Route> Routes => Set<Route>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Ascent> Ascents => Set<Ascent>();
    public DbSet<GradingSystem> GradingSystems => Set<GradingSystem>();
    public DbSet<Follower> Followers => Set<Follower>();
    public DbSet<Like> Likes => Set<Like>();
    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CruxaDbContext).Assembly);

        modelBuilder.Entity<GradingSystem>().HasData(
            new GradingSystem(
                DefaultGradingSystemId,
                "Fontainebleau (Bouldering)",
                new Dictionary<string, int>
                {
                    ["4a"] = 400, ["4b"] = 420, ["4c"] = 440,
                    ["5a"] = 460, ["5b"] = 480, ["5c"] = 500,
                    ["6a"] = 520, ["6a+"] = 540, ["6b"] = 560,
                    ["6b+"] = 580, ["6c"] = 600, ["6c+"] = 620,
                    ["7a"] = 640, ["7a+"] = 660, ["7b"] = 680,
                    ["7b+"] = 700, ["7c"] = 720, ["7c+"] = 740,
                    ["8a"] = 760, ["8a+"] = 780, ["8b"] = 800
                }
            )
        );
    }
}
