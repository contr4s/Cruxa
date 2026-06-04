namespace Cruxa.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;
using Domain.Enums;

internal class RouteConfiguration : IEntityTypeConfiguration<Route>
{
    public void Configure(EntityTypeBuilder<Route> builder)
    {
        builder.ToTable("routes");

        builder.HasKey(r => r.Id);

        builder.OwnsOne(r => r.Grade, gb =>
        {
            gb.Property(g => g.Raw)
                .HasColumnName("grade_raw")
                .IsRequired()
                .HasMaxLength(20);

            gb.Property(g => g.Index)
                .HasColumnName("grade_index")
                .IsRequired();

            gb.HasIndex(g => g.Index);
        });

        builder.Property(r => r.Type)
            .HasConversion<string>()
            .HasMaxLength(20)
            .HasDefaultValue(RouteType.Bouldering);

        builder.Property(r => r.HoldColor)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(r => r.PhotoUrls)
            .HasColumnType("text[]");

        builder.Property(r => r.Sector)
            .HasMaxLength(50);

        builder.Property(r => r.IsActive)
            .HasDefaultValue(true);

        builder.HasMany(r => r.Tags)
            .WithMany()
            .UsingEntity(j => j.ToTable("route_tags"));

        builder.HasIndex(r => r.GymId);

        builder.HasOne(r => r.Gym)
            .WithMany(g => g.Routes)
            .HasForeignKey(r => r.GymId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.Author)
            .WithMany()
            .HasForeignKey(r => r.AuthorId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(r => r.Reviews)
            .WithOne(rr => rr.Route)
            .HasForeignKey(rr => rr.RouteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
