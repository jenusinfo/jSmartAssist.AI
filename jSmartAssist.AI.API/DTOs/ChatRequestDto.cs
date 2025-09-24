namespace jSmartAssist.AI.API.DTOs
{
    public class ChatRequestDto
    {
        public string SessionId { get; set; }
        public string Message { get; set; }
        public string Category { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
    }
}