namespace jSmartAssist.AI.API.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public string SessionId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Message { get; set; }
        public bool IsUserMessage { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}