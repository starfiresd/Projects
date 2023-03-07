using Sabio.Data.Providers;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Sabio.Models.Domain.Messages;
using Sabio.Data;
using Sabio.Models;
using Sabio.Models.Requests.Messages;
using Sabio.Services.Interfaces;

namespace Sabio.Services
{
    public class MessageService : IMessageService
    {
        IDataProvider _data = null;

        public MessageService(IDataProvider data)
        {
            _data = data;
        }

        public Paged<Message> GetAll(int pageIndex, int pageSize)
        {
            Paged<Message> pagedList = null;
            List<Message> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Messages_SelectAll_Pagination]";

            _data.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Message message = MapSingleMessage(reader, ref startingIndex);
                totalCount = reader.GetSafeInt32(startingIndex);

                if (list == null)
                {
                    list = new List<Message>();
                }

                list.Add(message);
            });

            if (list != null)
            {
                pagedList = new Paged<Message>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Message GetById(int id)
        {
            string procName = "[dbo].[Messages_Select_ById]";
            Message message = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                message = MapSingleMessage(reader, ref startingIndex);
            });
            return message;
        }

        public Paged<Message> GetByRecipientId(int recipientId, int pageIndex, int pageSize)
        {
            Paged<Message> pagedList = null;
            List<Message> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Messages_Select_ByRecipientId_Pagination]";

            _data.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@RecipientId", recipientId);
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Message message = MapSingleMessage(reader, ref startingIndex);
                totalCount = reader.GetSafeInt32(startingIndex);

                if (list == null)
                {
                    list = new List<Message>();
                }

                list.Add(message);
            });

            if (list != null)
            {
                pagedList = new Paged<Message>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public List<Message> GetByUserIdRecentConversations(int userId)
        {
            List<Message> list = null;
            string procName = "[dbo].[Messages_Select_ByUserId_RecentConversations]";

            _data.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@UserId", userId);
    
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Message message = MapSingleMessage(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<Message>();
                }

                list.Add(message);
            });
            return list;
        }

        public Paged<Message> GetBySenderId(int senderId, int pageIndex, int pageSize)
        {
            Paged<Message> pagedList = null;
            List<Message> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Messages_Select_BySenderId_Pagination]";

            _data.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@SenderId", senderId);
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Message message = MapSingleMessage(reader, ref startingIndex);
                totalCount = reader.GetSafeInt32(startingIndex);

                if (list == null)
                {
                    list = new List<Message>();
                }

                list.Add(message);
            });

            if (list != null)
            {
                pagedList = new Paged<Message>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Message> GetByConversation(int senderId, int recipientId, int pageIndex, int pageSize)
        {
            Paged<Message> pagedList = null;
            List<Message> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Messages_Select_ByConversation_Pagination]";

            _data.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@SenderId", senderId);
                param.AddWithValue("@RecipientId", recipientId);
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Message message = MapSingleMessage(reader, ref startingIndex);
                totalCount = reader.GetSafeInt32(startingIndex);

                if (list == null)
                {
                    list = new List<Message>();
                }

                list.Add(message);
            });

            if (list != null)
            {
                pagedList = new Paged<Message>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public int Add(MessageAddRequest message)
        {
            int id = 0;
            string procName = "[dbo].[Messages_Insert]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
                {
                    AddCommonParams(message, col);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                }, delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });
            return id;
        }

        public void Update(MessageUpdateRequest message)
        {
            string procName = "[dbo].[Messages_Update]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
                {
                    AddCommonParams(message, col);
                    col.AddWithValue("@Id", message.Id);
                    col.AddWithValue("@DateSent", message.DateSent);
                    col.AddWithValue("@DateRead", message.DateRead);
                }, null);
        }

        public void UpdateSentDate(int id)
        {
            string procName = "[dbo].[Messages_Update_SentDateById]";
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Messages_Delete_ById]";
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                }, null);
        }

        private static Message MapSingleMessage(IDataReader reader, ref int startingIndex)
        {
            Message message = new Message();
            message.Id = reader.GetSafeInt32(startingIndex++);
            message.MessageText = reader.GetSafeString(startingIndex++);
            message.Subject = reader.GetSafeString(startingIndex++);
            message.RecipientId = reader.GetSafeInt32(startingIndex++);
            message.SenderId = reader.GetSafeInt32(startingIndex++);
            message.DateSent = reader.GetSafeDateTime(startingIndex++);
            message.DateRead = reader.GetSafeDateTime(startingIndex++);
            message.DateModified = reader.GetSafeDateTime(startingIndex++);
            message.DateCreated = reader.GetSafeDateTime(startingIndex++);
            return message;
        }

        private static void AddCommonParams(MessageAddRequest message, SqlParameterCollection col)
        {
            col.AddWithValue("@Message", message.MessageText);
            col.AddWithValue("@Subject", message.Subject);
            col.AddWithValue("@RecipientId", message.RecipientId);
            col.AddWithValue("@SenderId", message.SenderId);
        }
    }
}
