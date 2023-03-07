using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Sabio.Web.StartUp;
using Stripe;
using System.Data.SqlClient;
using System;
using Sabio.Models.Domain.Appointments;
using Sabio.Models;
using Sabio.Models.Requests.Appointments;
using SendGrid;
using Microsoft.AspNetCore.Authorization;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/appointments")]
    [ApiController]
    public class AppointmentApiController : BaseApiController
    {
        private IAppointmentService _service = null;
        private IAuthenticationService<int> _authService = null;

        public AppointmentApiController(IAppointmentService service
            , ILogger<AppointmentApiController> logger
            , IAuthenticationService<int> authenticationService) : base(logger)
        {
            _service = service;
            _authService = authenticationService;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Appointment>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Appointment course = _service.GetById(id);
                if (course == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Appointment> { Item = course };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Exception: {ex.Message}");
            }
            return StatusCode(iCode, response);

        }

        [HttpGet("client/paginate")]
        public ActionResult<ItemResponse<Paged<Appointment>>> GetByClientId(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                int currentUserId = _authService.GetCurrentUserId();
                Paged<Appointment> paged = _service.GetByClientId(currentUserId, pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Appointment>> response = new ItemResponse<Paged<Appointment>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }

            return result;
        }

        [HttpGet("attorneyProfile/paginate")]
        public ActionResult<ItemResponse<Paged<Appointment>>> GetByAttorneyId(int attorneyProfileId, int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<Appointment> paged = _service.GetByAttorneyId(attorneyProfileId, pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Appointment>> response = new ItemResponse<Paged<Appointment>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }

            return result;
        }

        [HttpGet("attorney/paginate")]
        [Authorize(Roles = "Attorney")]
        public ActionResult<ItemResponse<Paged<Appointment>>> GetByCreatedById(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                int currentUserId = _authService.GetCurrentUserId();
                Paged<Appointment> paged = _service.GetByCreatedById(currentUserId, pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Appointment>> response = new ItemResponse<Paged<Appointment>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }

            return result;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(AppointmentAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
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
        public ActionResult<ItemResponse<int>> Update(AppointmentUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            
            try 
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId); 
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
