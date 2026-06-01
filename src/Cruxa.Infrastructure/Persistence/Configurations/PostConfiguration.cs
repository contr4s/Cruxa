namespace Cruxa.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;
using Domain.Enums;

internal class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.ToTable("posts");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Description)
            .HasMaxLength(2000);

        builder.Property(p => p.MediaUrls)
            .HasColumnType("text[]");

        builder.Property(p => p.Visibility)
            .HasConversion<string>()
            .HasMaxLength(20)
            .HasDefaultValue(PostVisibility.Public);

        builder.Property(p => p.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .HasDefaultValue(PostStatus.Draft);

        builder.Property(p => p.CreatedAt)
            .IsRequired();

        builder.HasIndex(p => p.UserId);
        builder.HasIndex(p => p.GymId);
        builder.HasIndex(p => p.CreatedAt);

        builder.HasOne(p => p.User)
            .WithMany(u => u.Posts)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Gym)
            .WithMany(g => g.Posts)
            .HasForeignKey(p => p.GymId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
