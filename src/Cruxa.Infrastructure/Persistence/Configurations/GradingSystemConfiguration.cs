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

        builder.Property<string>("_gradeMappingJson")
            .HasColumnName("grade_mapping")
            .HasColumnType("jsonb")
            .IsRequired();

        // Map backing field for collection navigation
        builder.Navigation(gs => gs.Gyms)
            .HasField("_gyms")
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
