using Microsoft.EntityFrameworkCore;
using jSmartAssist.AI.API.Models;
using System.Security.Cryptography;
using System.Text;

namespace jSmartAssist.AI.API.Data
{
    public class AIAssistantContext : DbContext
    {
        public AIAssistantContext(DbContextOptions<AIAssistantContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<DocumentChunk> DocumentChunks { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<ChatSession> ChatSessions { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            string HashPassword(string password)
            {
                return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(password)));
            }

            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Username = "admin", Email = "admin@jassist.com", PasswordHash = HashPassword("Admin123!"), Role = "Admin" },
                new User { Id = 2, Username = "user", Email = "user@jassist.com", PasswordHash = HashPassword("User123#"), Role = "User" }
            );
        }
    }
}
