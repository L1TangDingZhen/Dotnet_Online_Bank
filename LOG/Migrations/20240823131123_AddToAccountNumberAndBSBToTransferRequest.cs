using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LOG.Migrations
{
    /// <inheritdoc />
    public partial class AddToAccountNumberAndBSBToTransferRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ToAccountId",
                table: "TransferRequests");

            migrationBuilder.AddColumn<string>(
                name: "ToAccountNumber",
                table: "TransferRequests",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ToBSB",
                table: "TransferRequests",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ToAccountNumber",
                table: "TransferRequests");

            migrationBuilder.DropColumn(
                name: "ToBSB",
                table: "TransferRequests");

            migrationBuilder.AddColumn<int>(
                name: "ToAccountId",
                table: "TransferRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
