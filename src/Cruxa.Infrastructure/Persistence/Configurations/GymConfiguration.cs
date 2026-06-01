namespace Cruxa.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

internal class GymConfiguration : IEntityTypeConfiguration<Gym>
{
    public void Configure(EntityTypeBuilder<Gym> builder)
    {
        builder.ToTable("gyms");

        builder.HasKey(g => g.Id);

        builder.Property(g => g.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(g => g.Description)
            .HasMaxLength(2000);

        builder.Property(g => g.City)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(g => g.Address)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(g => g.Prices)
            .HasColumnType("jsonb");

        builder.Property(g => g.WorkingHours)
            .HasColumnType("jsonb");

        builder.Property(g => g.PhotoUrls)
            .HasColumnType("text[]");

        builder.Property(g => g.ContactInfo)
            .HasMaxLength(300);

        builder.Property(g => g.Website)
            .HasMaxLength(500);

        builder.HasIndex(g => g.City);

        builder.HasOne(g => g.GradingSystem)
            .WithMany(gs => gs.Gyms)
            .HasForeignKey(g => g.GradingSystemId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
