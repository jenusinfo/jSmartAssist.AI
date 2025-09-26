using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using jSmartAssist.AI.API.Data;
using jSmartAssist.AI.API.Models;
using jSmartAssist.AI.API.Services;
using jSmartAssist.AI.API.DTOs;

namespace jSmartAssist.AI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly AIAssistantContext _context;
        private readonly IOllamaService _ollamaService;  // ADD THIS FIELD
        private readonly ILogger<ChatController> _logger;

        public ChatController(
            AIAssistantContext context,
            IOllamaService ollamaService,  // ADD THIS PARAMETER
            ILogger<ChatController> logger)
        {
            _context = context;
            _ollamaService = ollamaService;  // ADD THIS ASSIGNMENT
            _logger = logger;
        }

        // Test endpoint
        [HttpGet("test-ollama")]
        [AllowAnonymous]  // Temporary for testing
        public async Task<IActionResult> TestOllama()
        {
            try
            {
                var response = await _ollamaService.GenerateResponseAsync("Say 'Hello, Ollama is working!' if you can hear me.");
                return Ok(new { success = true, response });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, error = ex.Message });
            }
        }

        [HttpPost("message")]
        public async Task<ActionResult<ChatResponseDto>> SendMessage([FromBody] ChatRequestDto request)
        {
            try
            {
                // For now, test without document context
                var response = await _ollamaService.GenerateResponseAsync(request.Message);

                // Save to chat history
                var chatHistory = new ChatHistory
                {
                    SessionId = request.SessionId,
                    UserMessage = request.Message,
                    AssistantResponse = response,
                    CreatedAt = DateTime.UtcNow
                };

                _context.ChatHistories.Add(chatHistory);
                await _context.SaveChangesAsync();

                return Ok(new ChatResponseDto
                {
                    Response = response,
                    Documents = new List<DocumentReferenceDto>()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing chat message");
                return Ok(new ChatResponseDto
                {
                    Response = "I apologize, but I encountered an error. Please ensure the AI service is running.",
                    Documents = new List<DocumentReferenceDto>()
                });
            }
        }
    }
}