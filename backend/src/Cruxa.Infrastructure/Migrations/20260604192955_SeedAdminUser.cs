using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cruxa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        private const string AdminId = "00000000-0000-0000-0000-000000000001";

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "users",
                columns: ["Id", "Email", "Username", "PasswordHash", "Role", "CreatedAt"],
                values: new object[]
                {
                    Guid.Parse(AdminId),
                    "admin@cruxa.app",
                    "admin",
                    "Q1JVWEEtQURNSU4tU0FMVLrVWD8vtvnvYsW23/rWTI1v576stRytyA9eBoyRZinV",
                    "Admin",
                    new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "Id",
                keyValues: [Guid.Parse(AdminId)]);
        }
    }
}
