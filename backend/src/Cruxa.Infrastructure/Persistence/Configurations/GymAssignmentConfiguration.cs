namespace Cruxa.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

internal class GymAssignmentConfiguration : IEntityTypeConfiguration<GymAssignment>
{
    public void Configure(EntityTypeBuilder<GymAssignment> builder)
    {
        builder.ToTable("gym_assignments");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.RoleInGym)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasIndex(x => new { x.GymId, x.UserId, x.RoleInGym }).IsUnique();

        builder.HasOne(x => x.Gym)
            .WithMany()
            .HasForeignKey(x => x.GymId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
