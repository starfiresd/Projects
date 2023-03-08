using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hasty.Models.Domain.Messages
{
    public class ChatMessage
    {
        public string MessageText { get; set; }
        public string Subject { get; set; }
        public int RecipientId { get; set; }
        public int SenderId { get; set; }   
    }
}
