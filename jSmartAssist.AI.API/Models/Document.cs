using System.ComponentModel.DataAnnotations;

namespace jSmartAssist.AI.API.Models
{
    public class DocumentReference
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        [MaxLength(255)]
        public string FileName { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        // Foreign key for Category
        public int? CategoryId { get; set; }

        [Required]
        [MaxLength(100)]
        public string ContentType { get; set; }

        [Required]
        public string FilePath { get; set; }

        public long FileSize { get; set; }

        public DateTime UploadedAt { get; set; }

        public DateTime? ProcessedAt { get; set; }

        [MaxLength(50)]
        public string ProcessingStatus { get; set; } = "Pending";

        public string ProcessingError { get; set; }

        public int? ChunkCount { get; set; }

        [MaxLength(100)]
        public string UploadedBy { get; set; }

        // Navigation properties
        public virtual Category Category { get; set; }
        public virtual ICollection<DocumentChunk> DocumentChunks { get; set; } = new List<DocumentChunk>();
    }
}