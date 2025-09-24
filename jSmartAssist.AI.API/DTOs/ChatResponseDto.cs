namespace jSmartAssist.AI.API.DTOs
{
    public class ChatResponseDto
    {
        public string Response { get; set; } = string.Empty;
        public List<string> References { get; set; } = new();
    }
}