using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using jSmartAssist.AI.API.Data;
using jSmartAssist.AI.API.Models;
using jSmartAssist.AI.API.DTOs; 
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Logging;

namespace jSmartAssist.AI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly AIAssistantContext _context;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(AIAssistantContext context, ILogger<CategoryController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/category
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            try
            {
                var categories = await _context.Categories
                    .Include(c => c.Documents)
                    .Select(c => new CategoryDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description,
                        Icon = c.Icon,
                        Color = c.Color,
                        DocumentCount = c.Documents.Count,
                        IsActive = c.IsActive,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt
                    })
                    .OrderBy(c => c.DisplayOrder ?? 999)
                    .ThenBy(c => c.Name)
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving categories");
                return StatusCode(500, "An error occurred while retrieving categories");
            }
        }

        // GET: api/category/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            try
            {
                var category = await _context.Categories
                    .Include(c => c.Documents)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (category == null)
                {
                    return NotFound();
                }

                var categoryDto = new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    Description = category.Description,
                    Icon = category.Icon,
                    Color = category.Color,
                    DocumentCount = category.Documents.Count,
                    IsActive = category.IsActive,
                    CreatedAt = category.CreatedAt,
                    UpdatedAt = category.UpdatedAt
                };

                return Ok(categoryDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving category {CategoryId}", id);
                return StatusCode(500, "An error occurred while retrieving the category");
            }
        }

        // POST: api/category
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryDto createDto)
        {
            try
            {
                // Check if category with same name exists
                var existingCategory = await _context.Categories
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == createDto.Name.ToLower());

                if (existingCategory != null)
                {
                    return BadRequest("A category with this name already exists");
                }

                var category = new Category
                {
                    Name = createDto.Name,
                    Description = createDto.Description,
                    Icon = createDto.Icon ?? "folder",
                    Color = createDto.Color ?? "blue",
                    DisplayOrder = createDto.DisplayOrder,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                var categoryDto = new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    Description = category.Description,
                    Icon = category.Icon,
                    Color = category.Color,
                    DocumentCount = 0,
                    IsActive = category.IsActive,
                    CreatedAt = category.CreatedAt,
                    UpdatedAt = category.UpdatedAt
                };

                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, categoryDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category");
                return StatusCode(500, "An error occurred while creating the category");
            }
        }

        // PUT: api/category/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto updateDto)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);

                if (category == null)
                {
                    return NotFound();
                }

                // Check if another category with the same name exists
                var duplicateCategory = await _context.Categories
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == updateDto.Name.ToLower() && c.Id != id);

                if (duplicateCategory != null)
                {
                    return BadRequest("Another category with this name already exists");
                }

                category.Name = updateDto.Name;
                category.Description = updateDto.Description;
                category.Icon = updateDto.Icon ?? category.Icon;
                category.Color = updateDto.Color ?? category.Color;
                category.DisplayOrder = updateDto.DisplayOrder;
                category.IsActive = updateDto.IsActive;
                category.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating category {CategoryId}", id);
                return StatusCode(500, "An error occurred while updating the category");
            }
        }

        // DELETE: api/category/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var category = await _context.Categories
                    .Include(c => c.Documents)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (category == null)
                {
                    return NotFound();
                }

                // Check if category has documents
                if (category.Documents.Any())
                {
                    return BadRequest($"Cannot delete category. It contains {category.Documents.Count} documents. Please move or delete the documents first.");
                }

                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting category {CategoryId}", id);
                return StatusCode(500, "An error occurred while deleting the category");
            }
        }

        // POST: api/category/seed-defaults
        [HttpPost("seed-defaults")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SeedDefaultCategories()
        {
            try
            {
                var defaultCategories = new List<Category>
                {
                    new Category { Name = "Procedures", Description = "Company procedures and workflows", Icon = "settings", Color = "blue", DisplayOrder = 1 },
                    new Category { Name = "Operations", Description = "Operational guidelines and manuals", Icon = "wrench", Color = "green", DisplayOrder = 2 },
                    new Category { Name = "User Manuals", Description = "Product user manuals and guides", Icon = "book", Color = "purple", DisplayOrder = 3 },
                    new Category { Name = "Product Information", Description = "Product specifications and details", Icon = "info", Color = "orange", DisplayOrder = 4 },
                    new Category { Name = "Contact Information", Description = "Contact details and directories", Icon = "phone", Color = "red", DisplayOrder = 5 },
                    new Category { Name = "Policies", Description = "Company policies and regulations", Icon = "shield", Color = "indigo", DisplayOrder = 6 },
                    new Category { Name = "Training Materials", Description = "Training guides and resources", Icon = "graduation-cap", Color = "yellow", DisplayOrder = 7 },
                    new Category { Name = "Technical Documentation", Description = "Technical specifications and docs", Icon = "file-text", Color = "gray", DisplayOrder = 8 }
                };

                foreach (var defaultCategory in defaultCategories)
                {
                    var existingCategory = await _context.Categories
                        .FirstOrDefaultAsync(c => c.Name.ToLower() == defaultCategory.Name.ToLower());

                    if (existingCategory == null)
                    {
                        defaultCategory.IsActive = true;
                        defaultCategory.CreatedAt = DateTime.UtcNow;
                        defaultCategory.UpdatedAt = DateTime.UtcNow;
                        _context.Categories.Add(defaultCategory);
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Default categories seeded successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding default categories");
                return StatusCode(500, "An error occurred while seeding default categories");
            }
        }
    }
}