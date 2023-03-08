using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hasty.Models.Requests.Messages
{
    public class MessageAddRequest
    {
        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public string MessageText { get; set; }
        [StringLength(100, MinimumLength = 1)]
        public string Subject { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int RecipientId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int SenderId { get; set; }
    }
}
