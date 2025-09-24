namespace jSmartAssist.AI.API.Services
{
    public interface IFileProcessingService
    {
        Task ProcessDocumentAsync(int documentId, string filePath, string contentType);
    }
}