using Microsoft.EntityFrameworkCore;
using jSmartAssist.AI.API.Models;

namespace jSmartAssist.AI.API.Data
{
    public class AIAssistantContext : DbContext
    {
        public AIAssistantContext(DbContextOptions<AIAssistantContext> options)
            : base(options)
        {
        }


        public DbSet<User> Users { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<DocumentChunk> DocumentChunks { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<ChatHistory> ChatHistories { get; set; }
        public DbSet<ChatSession> ChatSessions { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Category configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.Icon).HasMaxLength(50);
                entity.Property(e => e.Color).HasMaxLength(20);
            });

            // Document configuration
            modelBuilder.Entity<Document>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.ProcessingStatus).HasMaxLength(50);

                // Relationship with Category
                entity.HasOne(d => d.Category)
                    .WithMany(c => c.Documents)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // DocumentChunk configuration
            modelBuilder.Entity<DocumentChunk>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.DocumentId, e.ChunkIndex });

                // Relationship with Document
                entity.HasOne(dc => dc.Document)
                    .WithMany(d => d.DocumentChunks)
                    .HasForeignKey(dc => dc.DocumentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ChatHistory configuration
            modelBuilder.Entity<ChatHistory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.SessionId);
                entity.HasIndex(e => e.CreatedAt);
            });
        }
    }
} 