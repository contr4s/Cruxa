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
    public DbSet<RouteFeedback> RouteFeedbacks => Set<RouteFeedback>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<PasswordCredential> PasswordCredentials => Set<PasswordCredential>();
    public DbSet<ExternalCredential> ExternalCredentials => Set<ExternalCredential>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<UserScoreSnapshot> UserScoreSnapshots => Set<UserScoreSnapshot>();
    public DbSet<GymAssignment> GymAssignments => Set<GymAssignment>();
    public DbSet<UserFavoriteGym> UserFavoriteGyms => Set<UserFavoriteGym>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CruxaDbContext).Assembly);

        modelBuilder.Entity<GradingSystem>().HasData(
            new GradingSystem(
                DefaultGradingSystemId,
                "Фонтенбло (Боулдеринг)",
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

        modelBuilder.Entity<Tag>().HasData(
            // тип
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000101"), "боулдеринг", "тип"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000102"), "скорость", "тип"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000103"), "трудность", "тип"),
            // рельеф
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000104"), "арка", "рельеф"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000105"), "вертикаль", "рельеф"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000106"), "камин", "рельеф"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000107"), "нависание", "рельеф"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000108"), "полка", "рельеф"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000109"), "положилово", "рельеф"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-00000000010a"), "потолок", "рельеф"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-00000000010b"), "распор", "рельеф"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-00000000010c"), "щель", "рельеф"),
            // стиль
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-00000000010d"), "баланс", "стиль"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-00000000010e"), "динамика", "стиль"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-00000000010f"), "кампус", "стиль"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000110"), "силовой", "стиль"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000111"), "статика", "стиль"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000112"), "техничный", "стиль"),
            // зацеп
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000113"), "карман", "зацеп"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000114"), "мизера", "зацеп"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000115"), "пассив", "зацеп"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000116"), "подхват", "зацеп"),
            Tag.CreateUnsafe(new Guid("00000000-0000-0000-0000-000000000117"), "щипок", "зацеп")
        );
    }
}
