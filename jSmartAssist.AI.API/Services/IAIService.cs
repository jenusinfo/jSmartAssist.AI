using jSmartAssist.AI.API.Models;
namespace jSmartAssist.AI.API.Services
{
    public interface IAIService
    {
        Task<string> GenerateResponseAsync(string message, List<DocumentChunk> relevantChunks);
        Task<string> GenerateEmbedding(string text);
        Task<List<DocumentChunk>> FindRelevantChunksAsync(string query, int topK = 5);
    }
}