namespace Cruxa.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

internal class UserFavoriteGymConfiguration : IEntityTypeConfiguration<UserFavoriteGym>
{
    public void Configure(EntityTypeBuilder<UserFavoriteGym> builder)
    {
        builder.ToTable("user_favorite_gyms");

        builder.HasKey(f => new { f.UserId, f.GymId });

        builder.Property(f => f.CreatedAt)
            .IsRequired();

        builder.HasOne(f => f.User)
            .WithMany()
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(f => f.Gym)
            .WithMany()
            .HasForeignKey(f => f.GymId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
