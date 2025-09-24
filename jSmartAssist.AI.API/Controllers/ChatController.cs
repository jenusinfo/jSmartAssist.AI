using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using jSmartAssist.AI.API.DTOs;
using jSmartAssist.AI.API.Services;

namespace jSmartAssist.AI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("message")]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequestDto request)
        {
            var response = await _chatService.ProcessMessageAsync(request);
            return Ok(response);
        }

        [HttpGet("history/{sessionId}")]
        public async Task<IActionResult> GetHistory(string sessionId)
        {
            var history = await _chatService.GetChatHistoryAsync(sessionId);
            return Ok(history);
        }
    }
}