using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cruxa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRouteReviewEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrivateNotes",
                table: "ascents");

            migrationBuilder.DropColumn(
                name: "PublicReview",
                table: "ascents");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "ascents");

            migrationBuilder.CreateTable(
                name: "route_reviews",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RouteId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Rating = table.Column<int>(type: "integer", maxLength: 2, nullable: true),
                    PrivateNotes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    PublicReview = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_route_reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_route_reviews_routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_route_reviews_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_route_reviews_RouteId",
                table: "route_reviews",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_route_reviews_RouteId_UserId",
                table: "route_reviews",
                columns: new[] { "RouteId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_route_reviews_UserId",
                table: "route_reviews",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "route_reviews");

            migrationBuilder.AddColumn<string>(
                name: "PrivateNotes",
                table: "ascents",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublicReview",
                table: "ascents",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "ascents",
                type: "integer",
                maxLength: 2,
                nullable: true);
        }
    }
}
