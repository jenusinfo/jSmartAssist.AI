using jSmartAssist.AI.API.Models;

namespace jSmartAssist.AI.API.Services
{
    public interface IAuthService
    {
        Task<(string accessToken, string refreshToken)?> AuthenticateUserAsync(string username, string password);
        string GenerateJwtToken(User user);
    }
}
