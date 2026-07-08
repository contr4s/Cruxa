namespace Cruxa.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

internal class UserScoreSnapshotConfiguration : IEntityTypeConfiguration<UserScoreSnapshot>
{
    public void Configure(EntityTypeBuilder<UserScoreSnapshot> builder)
    {
        builder.ToTable("user_score_snapshots");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Score)
            .HasPrecision(10, 2);

        builder.Property(s => s.Confidence)
            .HasPrecision(10, 2);

        builder.HasIndex(s => new { s.UserId, s.Date })
            .IsUnique();
    }
}
