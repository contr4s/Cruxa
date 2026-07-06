using System.Collections.Generic;
using Cruxa.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cruxa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeWorkingHoursToStructured : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<List<WorkingHoursEntry>>(
                name: "WorkingHours",
                table: "gyms",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "jsonb",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "WorkingHours",
                table: "gyms",
                type: "jsonb",
                nullable: true,
                oldClrType: typeof(List<WorkingHoursEntry>),
                oldType: "jsonb");
        }
    }
}
