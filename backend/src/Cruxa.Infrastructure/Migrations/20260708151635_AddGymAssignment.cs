using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cruxa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGymAssignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "gym_assignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GymId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleInGym = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_gym_assignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_gym_assignments_gyms_GymId",
                        column: x => x.GymId,
                        principalTable: "gyms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_gym_assignments_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_gym_assignments_GymId_UserId_RoleInGym",
                table: "gym_assignments",
                columns: new[] { "GymId", "UserId", "RoleInGym" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_gym_assignments_UserId",
                table: "gym_assignments",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "gym_assignments");
        }
    }
}
