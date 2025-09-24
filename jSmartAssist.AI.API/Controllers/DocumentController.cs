using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using jSmartAssist.AI.API.Data;
using jSmartAssist.AI.API.Models;
using jSmartAssist.AI.API.Services;

namespace jSmartAssist.AI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DocumentController : ControllerBase
    {
        private readonly AIAssistantContext _context;
        private readonly IFileProcessingService _fileService;

        public DocumentController(AIAssistantContext context, IFileProcessingService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var path = Path.Combine("uploads", file.FileName);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var document = new Document
            {
                FileName = file.FileName,
                ContentType = file.ContentType,
                UploadedAt = DateTime.UtcNow
            };
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            await _fileService.ProcessDocumentAsync(document.Id, path, file.ContentType);

            return Ok(new { DocumentId = document.Id });
        }
    }
}