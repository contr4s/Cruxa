using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Cruxa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedRussianTags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "grading_systems",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "Name",
                value: "Фонтенбло (Боулдеринг)");

            migrationBuilder.InsertData(
                table: "tags",
                columns: new[] { "Id", "Category", "Value" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000101"), "тип", "боулдеринг" },
                    { new Guid("00000000-0000-0000-0000-000000000102"), "тип", "скорость" },
                    { new Guid("00000000-0000-0000-0000-000000000103"), "тип", "трудность" },
                    { new Guid("00000000-0000-0000-0000-000000000104"), "рельеф", "арка" },
                    { new Guid("00000000-0000-0000-0000-000000000105"), "рельеф", "вертикаль" },
                    { new Guid("00000000-0000-0000-0000-000000000106"), "рельеф", "камин" },
                    { new Guid("00000000-0000-0000-0000-000000000107"), "рельеф", "нависание" },
                    { new Guid("00000000-0000-0000-0000-000000000108"), "рельеф", "полка" },
                    { new Guid("00000000-0000-0000-0000-000000000109"), "рельеф", "положилово" },
                    { new Guid("00000000-0000-0000-0000-00000000010a"), "рельеф", "потолок" },
                    { new Guid("00000000-0000-0000-0000-00000000010b"), "рельеф", "распор" },
                    { new Guid("00000000-0000-0000-0000-00000000010c"), "рельеф", "щель" },
                    { new Guid("00000000-0000-0000-0000-00000000010d"), "стиль", "баланс" },
                    { new Guid("00000000-0000-0000-0000-00000000010e"), "стиль", "динамика" },
                    { new Guid("00000000-0000-0000-0000-00000000010f"), "стиль", "кампус" },
                    { new Guid("00000000-0000-0000-0000-000000000110"), "стиль", "силовой" },
                    { new Guid("00000000-0000-0000-0000-000000000111"), "стиль", "статика" },
                    { new Guid("00000000-0000-0000-0000-000000000112"), "стиль", "техничный" },
                    { new Guid("00000000-0000-0000-0000-000000000113"), "зацеп", "карман" },
                    { new Guid("00000000-0000-0000-0000-000000000114"), "зацеп", "мизера" },
                    { new Guid("00000000-0000-0000-0000-000000000115"), "зацеп", "пассив" },
                    { new Guid("00000000-0000-0000-0000-000000000116"), "зацеп", "подхват" },
                    { new Guid("00000000-0000-0000-0000-000000000117"), "зацеп", "щипок" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000101"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000102"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000103"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000104"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000105"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000106"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000107"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000108"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000109"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-00000000010a"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-00000000010b"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-00000000010c"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-00000000010d"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-00000000010e"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-00000000010f"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000110"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000111"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000112"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000113"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000114"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000115"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000116"));

            migrationBuilder.DeleteData(
                table: "tags",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000117"));

            migrationBuilder.UpdateData(
                table: "grading_systems",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "Name",
                value: "Fontainebleau (Bouldering)");
        }
    }
}
