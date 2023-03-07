using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
using Sabio.Models;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Requests.Messages;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using Sabio.Web.Api.Hubs;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageApiController : BaseApiController
    {
        private IMessageService _service = null;
        private IAuthenticationService<int> _authService = null;
        private readonly IHubContext<ChatHub,IChatClient> _hubContext = null;

        public MessageApiController(IMessageService service
            , ILogger<MessageApiController> logger
            , IAuthenticationService<int> authenticationService
            ,IHubContext<ChatHub,IChatClient> hubContext) : base(logger)
        {
            _service = service;
            _authService = authenticationService;
            _hubContext = hubContext;
        }

        [HttpGet]
        public ActionResult<ItemResponse<Paged<Message>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Message> paged = _service.GetAll(pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<Message>>() { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
      
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Message>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Message message = _service.GetById(id);
                if (message == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Message> { Item = message };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Exception: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("recipient")]
        public ActionResult<ItemResponse<Paged<Message>>> GetByRecipientId(int recipientId, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Message> paged = _service.GetByRecipientId(recipientId, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<Message>>() { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("recent")]
        public ActionResult<ItemsResponse<Message>> GetByUserIdRecentConversations()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                List<Message> list = _service.GetByUserIdRecentConversations(userId);
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record Not Found");
                }
                else
                {
                    response = new ItemsResponse<Message> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("sender")]
        public ActionResult<ItemResponse<Paged<Message>>> GetBySenderId(int senderId, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Message> paged = _service.GetBySenderId(senderId, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<Message>>() { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("conversation")]
        public ActionResult<ItemResponse<Paged<Message>>> GetByConversation(int recipientId, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int senderId = _authService.GetCurrentUserId();
                Paged<Message> paged = _service.GetByConversation(senderId, recipientId, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<Message>>() { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(MessageAddRequest message)
        {
            ObjectResult result = null;

            try
            {
                int id = _service.Add(message);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
             
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(MessageUpdateRequest message)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(message);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPut("sentdate/{id:int}")]
        public ActionResult<ItemResponse<int>> UpdateSentDate(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.UpdateSentDate(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
    }
}
