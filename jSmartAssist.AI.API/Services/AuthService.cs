using jSmartAssist.AI.API.Models;
using jSmartAssist.AI.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace jSmartAssist.AI.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        private readonly AIAssistantContext _context;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IConfiguration config, AIAssistantContext context, ILogger<AuthService> logger)
        {
            _config = config;
            _context = context;
            _logger = logger;
        }

        public async Task<(string accessToken, string refreshToken)?> AuthenticateUserAsync(string username, string password)
        {
            _logger.LogInformation($"Login attempt for username/email: {username}");

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username || u.Email == username);

            if (user == null)
            {
                _logger.LogWarning($"User not found for: {username}");
                return null;
            }

            _logger.LogInformation($"User found: {user.Username}, Email: {user.Email}");

            if (!VerifyPassword(password, user.PasswordHash))
            {
                _logger.LogWarning($"Password verification failed for user: {user.Username}");
                _logger.LogDebug($"Expected hash: {user.PasswordHash}");
                _logger.LogDebug($"Provided password hash: {Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(password)))}");
                return null;
            }

            _logger.LogInformation($"Login successful for user: {user.Username}");

            var accessToken = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken(user);
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return (accessToken, refreshToken.Token);
        }

        public string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim("id", user.Id.ToString()),
                new Claim("role", user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiresInMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var hashedInput = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(password)));
            return hashedInput.Equals(storedHash, StringComparison.OrdinalIgnoreCase);
        }

        private RefreshToken GenerateRefreshToken(User user)
        {
            return new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.UtcNow.AddDays(7),
                IsRevoked = false,
                UserId = user.Id
            };
        }
    }
}