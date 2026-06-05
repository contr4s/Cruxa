using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cruxa.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGymContactEmailAndSocialLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "gyms",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "SocialLinks",
                table: "gyms",
                type: "text[]",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "gyms");

            migrationBuilder.DropColumn(
                name: "SocialLinks",
                table: "gyms");
        }
    }
}
