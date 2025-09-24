namespace jSmartAssist.AI.API.Models
{
    public class ChatHistory
    {
        public int Id { get; set; }
        public string SessionId { get; set; }
        public string UserMessage { get; set; }
        public string AssistantResponse { get; set; }
        public string Category { get; set; }
        public string ReferencedDocuments { get; set; } // JSON
        public int TokensUsed { get; set; }
        public double ResponseTime { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}