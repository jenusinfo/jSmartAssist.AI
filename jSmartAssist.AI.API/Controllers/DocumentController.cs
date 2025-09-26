using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using jSmartAssist.AI.API.Data;
using jSmartAssist.AI.API.Models;
using jSmartAssist.AI.API.Services;
using jSmartAssist.AI.API.DTOs;
using System.IO;

namespace jSmartAssist.AI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DocumentController : ControllerBase
    {
        private readonly AIAssistantContext _context;
        private readonly IFileProcessingService _fileService;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<DocumentController> _logger;
        private readonly string _uploadPath;

        public DocumentController(
            AIAssistantContext context,
            IFileProcessingService fileService,
            IWebHostEnvironment environment,
            ILogger<DocumentController> logger)
        {
            _context = context;
            _fileService = fileService;
            _environment = environment;
            _logger = logger;

            // Set upload path - create if doesn't exist
            _uploadPath = Path.Combine(_environment.ContentRootPath, "Uploads", "Documents");
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        // GET: api/document
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DocumentReferenceDto>>> GetDocuments()
        {
            try
            {
                var documents = await _context.Documents
                    .Include(d => d.Category)
                    .Include(d => d.DocumentChunks)
                    .OrderByDescending(d => d.UploadedAt)
                    .Select(d => new DocumentReferenceDto
                    {
                        Id = d.Id,
                        Title = d.Title ?? d.FileName, // Fallback to FileName if Title is null
                        FileName = d.FileName,
                        Description = d.Description,
                        CategoryId = d.CategoryId,
                        CategoryName = d.Category != null ? d.Category.Name : "Uncategorized",
                        ContentType = d.ContentType,
                        FileSize = d.FileSize,
                        ProcessingStatus = d.ProcessingStatus ?? "Pending",
                        ChunkCount = d.DocumentChunks.Count,
                        UploadedAt = d.UploadedAt,
                        ProcessedAt = d.ProcessedAt,
                        UploadedBy = d.UploadedBy ?? "Unknown"
                    })
                    .ToListAsync();

                return Ok(documents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving documents");
                return StatusCode(500, "An error occurred while retrieving documents");
            }
        }

        // GET: api/document/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DocumentReferenceDto>> GetDocument(int id)
        {
            try
            {
                var document = await _context.Documents
                    .Include(d => d.Category)
                    .Include(d => d.DocumentChunks)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (document == null)
                {
                    return NotFound();
                }

                var documentDto = new DocumentReferenceDto
                {
                    Id = document.Id,
                    Title = document.Title ?? document.FileName,
                    FileName = document.FileName,
                    Description = document.Description,
                    CategoryId = document.CategoryId,
                    CategoryName = document.Category?.Name ?? "Uncategorized",
                    ContentType = document.ContentType,
                    FileSize = document.FileSize,
                    ProcessingStatus = document.ProcessingStatus ?? "Pending",
                    ChunkCount = document.DocumentChunks.Count,
                    UploadedAt = document.UploadedAt,
                    ProcessedAt = document.ProcessedAt,
                    UploadedBy = document.UploadedBy ?? "Unknown",
                    ProcessingError = document.ProcessingError
                };

                return Ok(documentDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving document {DocumentId}", id);
                return StatusCode(500, "An error occurred while retrieving the document");
            }
        }

        // POST: api/document/upload
        [HttpPost("upload")]
        [Authorize(Roles = "Admin")]
        [RequestFormLimits(MultipartBodyLengthLimit = 104857600)] // 100MB limit
        public async Task<ActionResult<DocumentReferenceDto>> UploadDocument([FromForm] UploadDocumentDto uploadDto)
        {
            try
            {
                if (uploadDto.File == null || uploadDto.File.Length == 0)
                {
                    return BadRequest("No file uploaded");
                }

                // Validate file extension
                var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".txt", ".xls", ".xlsx" };
                var fileExtension = Path.GetExtension(uploadDto.File.FileName).ToLower();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest($"File type not allowed. Allowed types: {string.Join(", ", allowedExtensions)}");
                }

                // Validate file size (100MB max)
                if (uploadDto.File.Length > 104857600)
                {
                    return BadRequest("File size exceeds 100MB limit");
                }

                // Validate category exists
                if (uploadDto.CategoryId.HasValue)
                {
                    var categoryExists = await _context.Categories.AnyAsync(c => c.Id == uploadDto.CategoryId.Value);
                    if (!categoryExists)
                    {
                        return BadRequest("Invalid category ID");
                    }
                }

                // Generate unique filename
                var uniqueFileName = $"{Guid.NewGuid()}_{uploadDto.File.FileName}";
                var filePath = Path.Combine(_uploadPath, uniqueFileName);

                // Save file to disk
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await uploadDto.File.CopyToAsync(fileStream);
                }

                // Get username from claims
                var username = User.Identity?.Name ?? "Unknown";

                // Create document record
                var document = new DocumentReference
                {
                    Title = uploadDto.Title ?? Path.GetFileNameWithoutExtension(uploadDto.File.FileName),
                    // Replace this line in UploadDocument method:
                    // FilePath = uploadDto,

                    // With this line:
                    Description = uploadDto.Description ?? string.Empty,
                    CategoryId = uploadDto.CategoryId,
                    ContentType = uploadDto.File.ContentType,
                    FilePath = filePath,
                    FileName = uploadDto.File.FileName,
                    FileSize = uploadDto.File.Length,
                    ProcessingStatus = "Pending",
                    UploadedAt = DateTime.UtcNow,
                    UploadedBy = username
                };

                _context.Documents.Add(document);
                await _context.SaveChangesAsync();

                // Process document asynchronously
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await _fileService.ProcessDocumentAsync(document.Id, filePath, document.ContentType);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error processing document {DocumentId}", document.Id);
                        // Update document status to Failed
                        document.ProcessingStatus = "Failed";
                        document.ProcessingError = ex.Message;
                        await _context.SaveChangesAsync();
                    }
                });

                var documentDto = new DocumentReferenceDto
                {
                    Id = document.Id,
                    Title = document.Title,
                    FileName = document.FileName,
                    Description = document.Description,
                    CategoryId = document.CategoryId,
                    CategoryName = document.Category?.Name ?? "Uncategorized",
                    ContentType = document.ContentType,
                    FileSize = document.FileSize,
                    ProcessingStatus = document.ProcessingStatus,
                    UploadedAt = document.UploadedAt,
                    UploadedBy = document.UploadedBy
                };

                return CreatedAtAction(nameof(GetDocument), new { id = document.Id }, documentDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading document");
                return StatusCode(500, "An error occurred while uploading the document");
            }
        }

        // PUT: api/document/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateDocument(int id, UpdateDocumentDto updateDto)
        {
            try
            {
                var document = await _context.Documents.FindAsync(id);

                if (document == null)
                {
                    return NotFound();
                }

                // Validate category exists if provided
                if (updateDto.CategoryId.HasValue)
                {
                    var categoryExists = await _context.Categories.AnyAsync(c => c.Id == updateDto.CategoryId.Value);
                    if (!categoryExists)
                    {
                        return BadRequest("Invalid category ID");
                    }
                }

                document.Title = updateDto.Title ?? document.Title;
                document.Description = updateDto.Description ?? document.Description;
                document.CategoryId = updateDto.CategoryId ?? document.CategoryId;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating document {DocumentId}", id);
                return StatusCode(500, "An error occurred while updating the document");
            }
        }

        // DELETE: api/document/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            try
            {
                var document = await _context.Documents
                    .Include(d => d.DocumentChunks)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (document == null)
                {
                    return NotFound();
                }

                // Delete file from disk
                if (!string.IsNullOrEmpty(document.FilePath) && System.IO.File.Exists(document.FilePath))
                {
                    System.IO.File.Delete(document.FilePath);
                }

                // Delete document (chunks will be cascade deleted)
                _context.Documents.Remove(document);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting document {DocumentId}", id);
                return StatusCode(500, "An error occurred while deleting the document");
            }
        }

        // POST: api/document/5/reprocess
        [HttpPost("{id}/reprocess")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ReprocessDocument(int id)
        {
            try
            {
                var document = await _context.Documents.FindAsync(id);

                if (document == null)
                {
                    return NotFound();
                }

                if (!System.IO.File.Exists(document.FilePath))
                {
                    return BadRequest("Document file not found on disk");
                }

                // Reset processing status
                document.ProcessingStatus = "Pending";
                document.ProcessingError = null;
                await _context.SaveChangesAsync();

                // Reprocess document asynchronously
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await _fileService.ProcessDocumentAsync(document.Id, document.FilePath, document.ContentType);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error reprocessing document {DocumentId}", id);
                    }
                });

                return Ok(new { message = "Document reprocessing started" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reprocessing document {DocumentId}", id);
                return StatusCode(500, "An error occurred while reprocessing the document");
            }
        }

        // GET: api/document/stats
        [HttpGet("stats")]
        public async Task<ActionResult<DocumentStatsDto>> GetDocumentStats()
        {
            try
            {
                var stats = new DocumentStatsDto
                {
                    TotalDocuments = await _context.Documents.CountAsync(),
                    ProcessedDocuments = await _context.Documents.CountAsync(d => d.ProcessingStatus == "Processed"),
                    PendingDocuments = await _context.Documents.CountAsync(d => d.ProcessingStatus == "Pending"),
                    ProcessingDocuments = await _context.Documents.CountAsync(d => d.ProcessingStatus == "Processing"),
                    FailedDocuments = await _context.Documents.CountAsync(d => d.ProcessingStatus == "Failed"),
                    TotalChunks = await _context.DocumentChunks.CountAsync(),
                    CategoryBreakdown = await _context.Categories
                        .Select(c => new CategoryStatDto
                        {
                            CategoryName = c.Name,
                            DocumentCount = c.Documents.Count
                        })
                        .Where(c => c.DocumentCount > 0)
                        .ToListAsync()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving document stats");
                return StatusCode(500, "An error occurred while retrieving document stats");
            }
        }
    }
}