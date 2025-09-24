using jSmartAssist.AI.API.Data;
using jSmartAssist.AI.API.Models;

namespace jSmartAssist.AI.API.Services
{
    public class FileProcessingService : IFileProcessingService
    {
        private readonly AIAssistantContext _context;
        private readonly IAIService _aiService;
        public FileProcessingService(AIAssistantContext context, IAIService aiService)
        {
            _context = context;
            _aiService = aiService;
        }

        public async Task ProcessDocumentAsync(int documentId, string filePath, string contentType)
        {
            // TODO: Implement iText7 for PDF and OpenXML SDK for DOCX/XLSX parsing
            var text = "Sample extracted text";
            var chunk = new DocumentChunk
            {
                DocumentId = documentId,
                Text = text,
                EmbeddingVector = await _aiService.GenerateEmbedding(text)
            };
            _context.DocumentChunks.Add(chunk);
            await _context.SaveChangesAsync();
        }
    }
}