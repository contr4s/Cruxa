namespace Cruxa.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Entities;

internal class RouteFeedbackConfiguration : IEntityTypeConfiguration<RouteFeedback>
{
    public void Configure(EntityTypeBuilder<RouteFeedback> builder)
    {
        builder.ToTable("route_feedback");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Rating)
            .HasMaxLength(2); // 1-5

        builder.Property(r => r.GradeIndex);

        builder.Property(r => r.PrivateNotes)
            .HasMaxLength(1000);

        builder.Property(r => r.PublicReview)
            .HasMaxLength(1000);

        builder.Property(r => r.CreatedAt)
            .IsRequired();

        builder.Property(r => r.UpdatedAt);

        builder.HasIndex(r => r.RouteId);
        builder.HasIndex(r => r.UserId);
        builder.HasIndex(r => new { r.RouteId, r.UserId }).IsUnique(); // one feedback per user per route

        builder.HasOne(r => r.Route)
            .WithMany(rt => rt.Feedbacks)
            .HasForeignKey(r => r.RouteId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.User)
            .WithMany(u => u.Feedbacks)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
