namespace Cruxa.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

internal class FollowerConfiguration : IEntityTypeConfiguration<Follower>
{
    public void Configure(EntityTypeBuilder<Follower> builder)
    {
        builder.ToTable("followers");

        builder.HasKey(f => new { f.FollowerId, f.FolloweeId });

        builder.Property(f => f.CreatedAt)
            .IsRequired();

        builder.HasOne(f => f.FollowerUser)
            .WithMany(u => u.Following)
            .HasForeignKey(f => f.FollowerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(f => f.FolloweeUser)
            .WithMany(u => u.Followers)
            .HasForeignKey(f => f.FolloweeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
