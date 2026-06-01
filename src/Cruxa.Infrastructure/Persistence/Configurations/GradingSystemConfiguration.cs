namespace Cruxa.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

internal class GradingSystemConfiguration : IEntityTypeConfiguration<GradingSystem>
{
    public void Configure(EntityTypeBuilder<GradingSystem> builder)
    {
        builder.ToTable("grading_systems");

        builder.HasKey(gs => gs.Id);

        builder.Property(gs => gs.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(gs => gs.GradeMapping)
            .HasColumnType("jsonb")
            .IsRequired();
    }
}
