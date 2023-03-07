﻿using System;

namespace Sabio.Models.Domain.Messages
{
    public class Message
    {
        public int Id { get; set; }
        public string MessageText { get; set; }
        public string Subject { get; set; }
        public int RecipientId { get; set; }
        public int SenderId { get; set; }
        public DateTime DateSent { get; set; }
        public DateTime DateRead { get; set; }
        public DateTime DateModified { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
