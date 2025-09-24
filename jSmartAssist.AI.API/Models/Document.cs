namespace jSmartAssist.AI.API.Models
{
    public class Document
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
        public ICollection<DocumentChunk> Chunks { get; set; } = new List<DocumentChunk>();
    }
}