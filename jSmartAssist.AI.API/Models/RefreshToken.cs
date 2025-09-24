using System;
using System.ComponentModel.DataAnnotations;

namespace jSmartAssist.AI.API.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }

        [Required]
        public string Token { get; set; } = string.Empty;

        public DateTime Expires { get; set; }

        public bool IsRevoked { get; set; } = false;

        // Foreign key
        public int UserId { get; set; }
        public User User { get; set; } = default!;
    }
}