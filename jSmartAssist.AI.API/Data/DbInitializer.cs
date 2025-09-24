using System.Linq;
using jSmartAssist.AI.API.Models;
using Microsoft.AspNetCore.Identity;

namespace jSmartAssist.AI.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AIAssistantContext context)
        {
            if (context.Users.Any())
            {
                return;   // DB has been seeded
            }

            var hasher = new PasswordHasher<User>();

            var admin = new User
            {
                Username = "admin",
                Role = "Admin",
                PasswordHash = hasher.HashPassword(null!, "Admin@123")
            };

            var user = new User
            {
                Username = "user",
                Role = "User",
                PasswordHash = hasher.HashPassword(null!, "User@123")
            };

            context.Users.AddRange(admin, user);
            context.SaveChanges();
        }
    }
}
