using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cruxa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ModelSyncV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GradeRaw",
                table: "routes",
                newName: "grade_raw");

            migrationBuilder.RenameColumn(
                name: "GradeIndex",
                table: "routes",
                newName: "grade_index");

            migrationBuilder.RenameIndex(
                name: "IX_routes_GradeIndex",
                table: "routes",
                newName: "IX_routes_grade_index");

            migrationBuilder.RenameColumn(
                name: "Longitude",
                table: "gyms",
                newName: "longitude");

            migrationBuilder.RenameColumn(
                name: "Latitude",
                table: "gyms",
                newName: "latitude");

            migrationBuilder.RenameColumn(
                name: "GradeMapping",
                table: "grading_systems",
                newName: "grade_mapping");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "grade_raw",
                table: "routes",
                newName: "GradeRaw");

            migrationBuilder.RenameColumn(
                name: "grade_index",
                table: "routes",
                newName: "GradeIndex");

            migrationBuilder.RenameIndex(
                name: "IX_routes_grade_index",
                table: "routes",
                newName: "IX_routes_GradeIndex");

            migrationBuilder.RenameColumn(
                name: "longitude",
                table: "gyms",
                newName: "Longitude");

            migrationBuilder.RenameColumn(
                name: "latitude",
                table: "gyms",
                newName: "Latitude");

            migrationBuilder.RenameColumn(
                name: "grade_mapping",
                table: "grading_systems",
                newName: "GradeMapping");
        }
    }
}
