namespace jSmartAssist.AI.API.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public string SessionId { get; set; } = string.Empty;
        public string Sender { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
    }
}