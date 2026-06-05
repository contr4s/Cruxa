using System.Collections.Generic;
using Cruxa.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cruxa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGymDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "longitude",
                table: "gyms",
                type: "double precision",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<double>(
                name: "latitude",
                table: "gyms",
                type: "double precision",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<List<PriceItem>>(
                name: "Prices",
                table: "gyms",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "jsonb",
                oldNullable: true);

            migrationBuilder.AddColumn<double>(
                name: "MaxHeight",
                table: "gyms",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetroStations",
                table: "gyms",
                type: "jsonb",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "gyms",
                type: "jsonb",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddColumn<double>(
                name: "WallArea",
                table: "gyms",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "YearFounded",
                table: "gyms",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxHeight",
                table: "gyms");

            migrationBuilder.DropColumn(
                name: "MetroStations",
                table: "gyms");

            migrationBuilder.DropColumn(
                name: "Tags",
                table: "gyms");

            migrationBuilder.DropColumn(
                name: "WallArea",
                table: "gyms");

            migrationBuilder.DropColumn(
                name: "YearFounded",
                table: "gyms");

            migrationBuilder.AlterColumn<double>(
                name: "longitude",
                table: "gyms",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldNullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "latitude",
                table: "gyms",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Prices",
                table: "gyms",
                type: "jsonb",
                nullable: true,
                oldClrType: typeof(List<PriceItem>),
                oldType: "jsonb");
        }
    }
}
