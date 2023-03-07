using Sabio.Models;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Requests.Messages;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IMessageService
    {
        Paged<Message> GetAll(int pageIndex, int pageSize);
        Message GetById(int id);
        Paged<Message> GetByRecipientId(int recipientId, int pageIndex, int pageSize);
        List<Message> GetByUserIdRecentConversations(int userId);
        Paged<Message> GetBySenderId(int senderId, int pageIndex, int pageSize);
        Paged<Message> GetByConversation(int senderId, int recipientId, int pageIndex, int pageSize);
        int Add(MessageAddRequest message);
        void Update(MessageUpdateRequest message);
        void UpdateSentDate(int id);
        void Delete(int id);
       
    }
}