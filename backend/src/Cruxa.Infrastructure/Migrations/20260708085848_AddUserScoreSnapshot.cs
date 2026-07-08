using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cruxa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserScoreSnapshot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "user_score_snapshots",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    Score = table.Column<double>(type: "double precision", precision: 10, scale: 2, nullable: false),
                    Confidence = table.Column<double>(type: "double precision", precision: 10, scale: 2, nullable: false),
                    MaxGradeIndex = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_score_snapshots", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_user_score_snapshots_UserId_Date",
                table: "user_score_snapshots",
                columns: new[] { "UserId", "Date" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_score_snapshots");
        }
    }
}
