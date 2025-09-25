namespace jSmartAssist.AI.API.DTOs
{
    //public class DocumentReferenceDto
    //{
    //    public int Id { get; set; }
    //    public string Title { get; set; }
    //    public string FileName { get; set; }
    //    public string Category { get; set; }
    //}
    public class DocumentDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string ContentType { get; set; }
        public long FileSize { get; set; }
        public string ProcessingStatus { get; set; }
        public string ProcessingError { get; set; }
        public int ChunkCount { get; set; }
        public DateTime UploadedAt { get; set; }
        public DateTime? ProcessedAt { get; set; }
        public string UploadedBy { get; set; }
    }

    public class UploadDocumentDto
    {
        public IFormFile File { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int? CategoryId { get; set; }
    }

    public class UpdateDocumentDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int? CategoryId { get; set; }
    }

    public class DocumentStatsDto
    {
        public int TotalDocuments { get; set; }
        public int ProcessedDocuments { get; set; }
        public int PendingDocuments { get; set; }
        public int ProcessingDocuments { get; set; }
        public int FailedDocuments { get; set; }
        public int TotalChunks { get; set; }
        public List<CategoryStatDto> CategoryBreakdown { get; set; }
    }

    public class CategoryStatDto
    {
        public string CategoryName { get; set; }
        public int DocumentCount { get; set; }
    }
}