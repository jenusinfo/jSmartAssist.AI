using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace jSmartAssist.AI.API.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Email", "PasswordHash" },
                values: new object[] { "admin@jsmartassist.com", "3EB3FE66B31E3B4D10FA70B5CAD49C7112294AF6AE4E476A1C405155D45AA121" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "Email",
                value: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "3319767B84A08DFFB6AF200F0B3E3361E09EB2A665837A7C8D63EF42841975C9");
        }
    }
}
