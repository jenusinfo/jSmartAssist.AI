using System.ComponentModel.DataAnnotations;

namespace jSmartAssist.AI.API.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        [MaxLength(50)]
        public string Icon { get; set; } = "folder";

        [MaxLength(20)]
        public string Color { get; set; } = "blue";

        public int? DisplayOrder { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // Navigation property
        public virtual ICollection<DocumentReference> Documents { get; set; } = new List<DocumentReference>();
    }
}