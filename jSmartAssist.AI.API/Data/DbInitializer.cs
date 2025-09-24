using jSmartAssist.AI.API.Models;
using System.Security.Cryptography;
using System.Text;

namespace jSmartAssist.AI.API.Data
{
    public static class DbInitializer
    {
        private static string HashPassword(string password)
        {
            return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(password)));
        }

        public static void Seed(AIAssistantContext context)
        {
            // Ensure DB exists
            context.Database.EnsureCreated();

            // Admin user
            if (!context.Users.Any(u => u.Username == "admin"))
            {
                context.Users.Add(new User
                {
                    Username = "admin",
                    Email = "admin@jsmartassist.com",
                    PasswordHash = HashPassword("Admin123!"),
                    Role = "Admin"
                });
            }

            // Regular user
            if (!context.Users.Any(u => u.Username == "user"))
            {
                context.Users.Add(new User
                {
                    Username = "user",
                    Email = "user@jsmartassist.com",
                    PasswordHash = HashPassword("User123#"),
                    Role = "User"
                });
            }

            context.SaveChanges();
        }
    }
}
