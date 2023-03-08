using System.Threading.Tasks;
using Hasty.Models.Domain.Messages;
using Microsoft.AspNetCore.SignalR;
using Hasty.Services.Interfaces;
using System;
using Hasty.Models;

namespace Hasty.Web.Api.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        public async Task SendMessage(ChatMessage message)
        {
            await Clients.All.ReceiveMessage(message);
        }

    }
}
