namespace Cruxa.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

internal class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder.ToTable("tags");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Value)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(t => t.Category)
            .HasMaxLength(50);

        builder.HasIndex(t => t.Value)
            .IsUnique();
    }
}
