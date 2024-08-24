using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LOG.Migrations
{
    /// <inheritdoc />
    public partial class AddCreateUserAndOtherModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Pin",
                table: "Accounts",
                type: "varchar(6)",
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Pin",
                table: "Accounts");
        }
    }
}
