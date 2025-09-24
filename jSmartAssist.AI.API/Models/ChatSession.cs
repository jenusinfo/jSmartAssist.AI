namespace jSmartAssist.AI.API.Models
{
    public class ChatSession
    {
        public string Id { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
    }
}