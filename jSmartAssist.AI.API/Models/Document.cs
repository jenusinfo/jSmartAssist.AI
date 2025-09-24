namespace jSmartAssist.AI.API.Models
{
    public class Document
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public string ContentType { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadedAt { get; set; }
        public DateTime? ProcessedAt { get; set; }
        public string ProcessingStatus { get; set; } = "Pending";
        public string ProcessingError { get; set; }
        public int? ChunkCount { get; set; }

        // Navigation property
        public virtual ICollection<DocumentChunk> DocumentChunks { get; set; }
    }
}