namespace jSmartAssist.AI.API.Models
{
    public class DocumentChunk
    {
        public int Id { get; set; }
        public int DocumentId { get; set; }
        public string Text { get; set; } = string.Empty;
        public string EmbeddingVector { get; set; } = string.Empty; // JSON serialized vector
        public Document Document { get; set; } = default!;
    }
}