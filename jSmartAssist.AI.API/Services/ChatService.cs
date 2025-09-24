using jSmartAssist.AI.API.DTOs;
using jSmartAssist.AI.API.Models;
using jSmartAssist.AI.API.Data;
using Microsoft.EntityFrameworkCore;

namespace jSmartAssist.AI.API.Services
{
    public class ChatService : IChatService
    {
        private readonly AIAssistantContext _context;
        private readonly IAIService _aiService;
        public ChatService(AIAssistantContext context, IAIService aiService)
        {
            _context = context;
            _aiService = aiService;
        }

        public async Task<ChatResponseDto> ProcessMessageAsync(ChatRequestDto request)
        {
            var chunks = await _aiService.FindRelevantChunksAsync(request.Message);
            var response = await _aiService.GenerateResponseAsync(request.Message, chunks);
            return new ChatResponseDto { Response = response, References = chunks.Select(c => c.Text).ToList() };
        }

        public async Task<List<ChatMessage>> GetChatHistoryAsync(string sessionId)
        {
            return await _context.ChatMessages.Where(m => m.SessionId == sessionId).ToListAsync();
        }
    }
}