using jSmartAssist.AI.API.Models;
using jSmartAssist.AI.API.Data;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace jSmartAssist.AI.API.Services
{
    public class AIService : IAIService
    {
        private readonly AIAssistantContext _context;
        private readonly HttpClient _http;
        private readonly IConfiguration _config;

        public AIService(AIAssistantContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
            _http = new HttpClient();
        }

        public async Task<string> GenerateResponseAsync(string message, List<DocumentChunk> relevantChunks)
        {
            var context = string.Join("\n", relevantChunks.Select(c => c.Text));
            var request = new
            {
                model = _config["Ollama:ModelName"],
                prompt = $"Answer the question based on context.\nContext: {context}\nQuestion: {message}"
            };
            var response = await _http.PostAsJsonAsync($"{_config["Ollama:BaseUrl"]}/api/generate", request);
            return await response.Content.ReadAsStringAsync();
        }

        public string GenerateEmbedding(string text)
        {
            // Stub: replace with local embedding service (SentenceTransformers exposed via REST or ONNX)
            return JsonConvert.SerializeObject(new float[] { 0.1f, 0.2f, 0.3f });
        }

        public async Task<List<DocumentChunk>> FindRelevantChunksAsync(string query, int topK = 5)
        {
            // Simplified placeholder: just returns topK chunks
            return await _context.DocumentChunks.Take(topK).ToListAsync();
        }

        Task<string> IAIService.GenerateEmbedding(string text)
        {
            throw new NotImplementedException();
        }
    }
}