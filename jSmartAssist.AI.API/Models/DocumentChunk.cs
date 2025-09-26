namespace jSmartAssist.AI.API.Models
{
    public class DocumentChunk
    {
        public int Id { get; set; }
        public int DocumentId { get; set; }
        public int ChunkIndex { get; set; }
        public string Text { get; set; }
        public string EmbeddingVector { get; set; } // JSON serialized float array
        public DateTime CreatedAt { get; set; }

        // Navigation property
        public virtual DocumentReference Document { get; set; }
    }
}