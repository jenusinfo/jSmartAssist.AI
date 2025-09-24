using jSmartAssist.AI.API.DTOs;
using jSmartAssist.AI.API.Models;
namespace jSmartAssist.AI.API.Services
{
    public interface IChatService
    {
        Task<ChatResponseDto> ProcessMessageAsync(ChatRequestDto request);
        Task<List<ChatMessage>> GetChatHistoryAsync(string sessionId);
    }
}