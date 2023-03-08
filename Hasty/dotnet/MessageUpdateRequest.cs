using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hasty.Models.Requests.Messages
{
    public class MessageUpdateRequest : MessageAddRequest, IModelIdentifier
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int Id { get; set; }
        public DateTime DateSent { get; set; }
        public DateTime DateRead { get; set; }
    }
}
