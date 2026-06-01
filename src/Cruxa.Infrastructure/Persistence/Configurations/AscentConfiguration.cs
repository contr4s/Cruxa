namespace Cruxa.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;
using Domain.Enums;

internal class AscentConfiguration : IEntityTypeConfiguration<Ascent>
{
    public void Configure(EntityTypeBuilder<Ascent> builder)
    {
        builder.ToTable("ascents");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Style)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(a => a.Rating)
            .HasMaxLength(2); // 1-5

        builder.Property(a => a.MediaUrls)
            .HasColumnType("text[]");

        builder.Property(a => a.PrivateNotes)
            .HasMaxLength(1000);

        builder.Property(a => a.PublicReview)
            .HasMaxLength(1000);

        builder.Property(a => a.CreatedAt)
            .IsRequired();

        builder.HasIndex(a => a.PostId);
        builder.HasIndex(a => a.UserId);
        builder.HasIndex(a => a.RouteId);

        builder.HasOne(a => a.Post)
            .WithMany(p => p.Ascents)
            .HasForeignKey(a => a.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.User)
            .WithMany(u => u.Ascents)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Route)
            .WithMany(r => r.Ascents)
            .HasForeignKey(a => a.RouteId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
