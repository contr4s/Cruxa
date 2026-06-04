using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cruxa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTagEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tags",
                table: "routes");

            migrationBuilder.CreateTable(
                name: "tags",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Value = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "route_tags",
                columns: table => new
                {
                    RouteId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_route_tags", x => new { x.RouteId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_route_tags_routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_route_tags_tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_route_tags_TagsId",
                table: "route_tags",
                column: "TagsId");

            migrationBuilder.CreateIndex(
                name: "IX_tags_Value",
                table: "tags",
                column: "Value",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "route_tags");

            migrationBuilder.DropTable(
                name: "tags");

            migrationBuilder.AddColumn<List<string>>(
                name: "Tags",
                table: "routes",
                type: "text[]",
                nullable: false);
        }
    }
}
