namespace jSmartAssist.AI.API.DTOs
{
    public class ChatResponseDto
    {
        public string Response { get; set; }
        public List<string> References { get; set; }
        public List<DocumentReferenceDto> Documents { get; set; }
        public int TokensUsed { get; set; }
    }
}