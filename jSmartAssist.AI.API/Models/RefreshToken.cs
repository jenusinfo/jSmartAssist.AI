using System;
using System.ComponentModel.DataAnnotations;

namespace jSmartAssist.AI.API.Models
{
    public class RefreshToken
    {
        internal bool IsRevoked;

        public int Id { get; set; }
        [Required]
        public string Token { get; set; } = string.Empty;
        public DateTime Expires { get; set; }
        public bool Revoked { get; set; } = false;

        // Foreign key
        public int UserId { get; set; }
        public User User { get; set; } = default!;
    }
}
