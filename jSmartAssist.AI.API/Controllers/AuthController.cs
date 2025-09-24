using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using jSmartAssist.AI.API.Services;
using jSmartAssist.AI.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;

namespace jSmartAssist.AI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly AIAssistantContext _context;

        public AuthController(IAuthService authService, AIAssistantContext context)
        {
            _authService = authService;
            _context = context;
        }

        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.AuthenticateUserAsync(request.Username, request.Password);
            if (result == null)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(new
            {
                accessToken = result.Value.accessToken,
                refreshToken = result.Value.refreshToken
            });
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh([FromBody] string refreshToken)
        {
            var storedToken = await _context.RefreshTokens
                .Include(r => r.User)
                .SingleOrDefaultAsync(r => r.Token == refreshToken && !r.IsRevoked);

            if (storedToken == null || storedToken.Expires < DateTime.UtcNow)
                return Unauthorized(new { message = "Invalid refresh token" });

            var newAccessToken = _authService.GenerateJwtToken(storedToken.User);
            return Ok(new { token = newAccessToken });
        }

        [HttpGet("test-users")]
        [AllowAnonymous]
        public async Task<IActionResult> TestUsers()
        {
            var users = await _context.Users.Select(u => new
            {
                u.Username,
                u.Email,
                u.Role,
                PasswordLength = u.PasswordHash.Length
            }).ToListAsync();

            return Ok(new
            {
                users = users,
                totalCount = users.Count,
                message = "These are the users in your database"
            });
        }
    }
}