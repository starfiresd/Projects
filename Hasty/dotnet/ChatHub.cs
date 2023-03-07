using System.Threading.Tasks;
using Sabio.Models.Domain.Messages;
using Microsoft.AspNetCore.SignalR;
using Sabio.Services.Interfaces;
using System;
using Sabio.Models;

namespace Sabio.Web.Api.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        public async Task SendMessage(ChatMessage message)
        {
            await Clients.All.ReceiveMessage(message);
        }

    }
}