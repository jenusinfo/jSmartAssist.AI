using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace jSmartAssist.AI.API.Services
{
    public interface IOllamaService
    {
        Task<string> GenerateResponseAsync(string prompt);
        Task<string> GenerateResponseWithContextAsync(string userMessage, List<string> contextChunks);
        Task<float[]> GenerateEmbeddingAsync(string text);
    }

    public class OllamaService : IOllamaService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<OllamaService> _logger;
        private readonly string _ollamaUrl;
        private readonly string _modelName;
        private readonly string _embeddingModel;

        public OllamaService(
            HttpClient httpClient,
            ILogger<OllamaService> logger,
            IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;

            // Read from appsettings.json
            _ollamaUrl = configuration["Ollama:BaseUrl"] ?? "http://localhost:11434";
            _modelName = configuration["Ollama:ModelName"] ?? "mistral:7b";
            _embeddingModel = configuration["Ollama:EmbeddingModel"] ?? "all-minilm:latest";
        }

        public async Task<string> GenerateResponseAsync(string prompt)
        {
            try
            {
                // Use the chat endpoint (works with current Ollama)
                var request = new
                {
                    model = _modelName,
                    messages = new[]
                    {
                        new { role = "user", content = prompt }
                    },
                    stream = false
                };

                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{_ollamaUrl}/api/chat", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation("Received response from Ollama");

                    // Parse the chat response
                    using var doc = JsonDocument.Parse(responseContent);
                    if (doc.RootElement.TryGetProperty("message", out var message))
                    {
                        if (message.TryGetProperty("content", out var contentProp))
                        {
                            return contentProp.GetString() ?? "No response generated";
                        }
                    }

                    return "Response format unexpected";
                }

                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError($"Ollama API error: {response.StatusCode}, Content: {errorContent}");
                return "Sorry, I couldn't generate a response at this time.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error calling Ollama: {ex.Message}");
                return "AI service is not available. Please ensure Ollama is running.";
            }
        }

        public async Task<string> GenerateResponseWithContextAsync(string userMessage, List<string> contextChunks)
        {
            try
            {
                var context = string.Join("\n\n", contextChunks);

                var request = new
                {
                    model = _modelName,
                    messages = new[]
                    {
                        new {
                            role = "system",
                            content = "You are a helpful AI assistant. Answer questions based on the provided context from company documents."
                        },
                        new {
                            role = "user",
                            content = $"Context:\n{context}\n\nQuestion: {userMessage}\n\nProvide an answer based on the context above."
                        }
                    },
                    stream = false
                };

                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{_ollamaUrl}/api/chat", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(responseContent);
                    if (doc.RootElement.TryGetProperty("message", out var message))
                    {
                        if (message.TryGetProperty("content", out var contentProp))
                        {
                            return contentProp.GetString() ?? "No response generated";
                        }
                    }
                }

                return "Could not generate response with context.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GenerateResponseWithContextAsync");
                return "Error processing your request.";
            }
        }

        public async Task<float[]> GenerateEmbeddingAsync(string text)
        {
            try
            {
                var request = new
                {
                    model = _embeddingModel,
                    prompt = text
                };

                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{_ollamaUrl}/api/embeddings", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(responseContent);

                    if (doc.RootElement.TryGetProperty("embedding", out var embedding))
                    {
                        var floatArray = new List<float>();
                        foreach (var element in embedding.EnumerateArray())
                        {
                            floatArray.Add((float)element.GetDouble());
                        }
                        return floatArray.ToArray();
                    }
                }

                return Array.Empty<float>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating embedding");
                return Array.Empty<float>();
            }
        }
    }
}