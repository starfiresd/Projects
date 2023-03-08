using Migrately.Data.Providers;
using Migrately.Models.Domain.Appointments;
using Stripe;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Migrately.Data;
using Migrately.Services.Interfaces;
using Migrately.Models.Domain;
using Migrately.Models.Domain.Attorneys;
using Migrately.Models.Domain.Users;
using System.Net;
using Migrately.Models;
using Migrately.Models.Requests.Appointments;

namespace Migrately.Services
{
    public class AppointmentService : IAppointmentService
    {
        IDataProvider _data = null;
        private static IUserService _userService = null;
        private static IAttorneyService _attorneyService = null;

        public AppointmentService(IDataProvider data
                                    , IUserService userService
                                    , IAttorneyService attorneyService)
        {
            _data = data;
            _userService = userService;
            _attorneyService = attorneyService;
        }

        public Appointment GetById(int id)
        {
            string procName = "[dbo].[Appointments_Select_ById]";
            Appointment appointment = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                appointment = MapSingleAppointment(reader, ref startingIndex);
            });
            return appointment;
        }

        public Paged<Appointment> GetByClientId(int clientId, int pageIndex, int pageSize)
        {
            Paged<Appointment> pagedList = null;
            List<Appointment> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Appointments_Select_ByClientId_Paginated]";

            _data.ExecuteCmd(procName, inputParamMapper: (param) =>
            {
                param.AddWithValue("@ClientId", clientId);
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            }
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Appointment appointment = MapSingleAppointment(reader, ref startingIndex);
                totalCount = reader.GetSafeInt32(startingIndex);

                if (list == null)
                {
                    list = new List<Appointment>();
                }

                list.Add(appointment);
            });

            if (list != null)
            {
                pagedList = new Paged<Appointment>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Appointment> GetByAttorneyId(int attorneyProfileId, int pageIndex, int pageSize)
        {
            Paged<Appointment> pagedList = null;
            List<Appointment> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Appointments_Select_ByAttorneyId_Paginated]";

            _data.ExecuteCmd(procName, inputParamMapper: (param) =>
            {
                param.AddWithValue("@AttorneyProfileId", attorneyProfileId);
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            }
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Appointment appointment = MapSingleAppointment(reader, ref startingIndex);
                totalCount = reader.GetSafeInt32(startingIndex);

                if (list == null)
                {
                    list = new List<Appointment>();
                }

                list.Add(appointment);
            });

            if (list != null)
            {
                pagedList = new Paged<Appointment>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Appointment> GetByCreatedById(int createdById, int pageIndex, int pageSize)
        {
            Paged<Appointment> pagedList = null;
            List<Appointment> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Appointments_Select_ByCreatedBy_Paginated]";

            _data.ExecuteCmd(procName, inputParamMapper: (param) =>
            {
                param.AddWithValue("@CreatedById", createdById);
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            }
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Appointment appointment = MapSingleAppointment(reader, ref startingIndex);
                totalCount = reader.GetSafeInt32(startingIndex);

                if (list == null)
                {
                    list = new List<Appointment>();
                }

                list.Add(appointment);
            });

            if (list != null)
            {
                pagedList = new Paged<Appointment>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public int Add(AppointmentAddRequest appointment, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Appointments_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(appointment, col);
                    col.AddWithValue("@CreatedBy", userId);
                    col.AddWithValue("@ModifiedBy", userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });
            return id;
        }

        public void Update(AppointmentUpdateRequest appointment, int userId)
        {
            string procName = "[dbo].[Appointments_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(appointment, col);
                    col.AddWithValue("@Id", appointment.Id);
                    col.AddWithValue("@ModifiedBy", userId);
                },
                returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Appointments_Delete]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                },
                returnParameters: null);
        }

        private static Appointment MapSingleAppointment(IDataReader reader, ref int startingIndex)
        {
            Appointment appointment = new Appointment();
            LookUp appointmentType = new LookUp();
            User client = new User();
            LookUp clientStatus = new LookUp();
            Attorney attorney = new Attorney();
            LookUp appointmentStatus = new LookUp();
            User createdBy = new User();
            LookUp createdByStatus = new LookUp();
            User modifiedBy = new User();
            LookUp modifiedByStatus = new LookUp();

            appointment.Id = reader.GetSafeInt32(startingIndex++);
            appointmentType.Id = reader.GetSafeInt32(startingIndex++);
            appointmentType.Name = reader.GetString(startingIndex++);
            appointment.AppointmentType = appointmentType;
            client.UserId = reader.GetSafeInt32(startingIndex++);
            client.FirstName = reader.GetSafeString(startingIndex++);
            client.MiddleInitial = reader.GetSafeString(startingIndex++);
            client.LastName = reader.GetSafeString(startingIndex++);
            client.AvatarUrl = reader.GetSafeString(startingIndex++);
            client.Email = reader.GetSafeString(startingIndex++);
            clientStatus.Id = reader.GetSafeInt32(startingIndex++);
            clientStatus.Name = reader.GetSafeString(startingIndex++);
            client.Status = clientStatus;
            string roles = reader.GetSafeString(startingIndex++);
            if (!string.IsNullOrEmpty(roles))
            {
                client.Role = Newtonsoft.Json.JsonConvert.DeserializeObject<List<LookUp>>(roles);
            }
            else
            {
                client.Role = new List<LookUp>();
            }
            appointment.Client = client;
            attorney = _attorneyService.MapSingleAttorney(reader, ref startingIndex);
            appointment.AttorneyProfile = attorney;
            appointment.Notes = reader.GetSafeString(startingIndex++);
            appointment.IsConfirmed = reader.GetBoolean(startingIndex++);
            appointment.AppointmentStart = reader.GetSafeDateTime(startingIndex++);
            appointment.AppointmentEnd = reader.GetSafeDateTime(startingIndex++);
            appointmentStatus.Id = reader.GetSafeInt32(startingIndex++);
            appointmentStatus.Name = reader.GetSafeString(startingIndex++);
            appointment.Status = appointmentStatus;
            appointment.DateCreated = reader.GetSafeDateTime(startingIndex++);
            appointment.DateModified = reader.GetSafeDateTime(startingIndex++);
            createdBy.UserId = reader.GetSafeInt32(startingIndex++);
            createdBy.FirstName = reader.GetSafeString(startingIndex++);
            createdBy.MiddleInitial = reader.GetSafeString(startingIndex++);
            createdBy.LastName = reader.GetSafeString(startingIndex++);
            createdBy.AvatarUrl = reader.GetSafeString(startingIndex++);
            createdBy.Email = reader.GetSafeString(startingIndex++);
            createdByStatus.Id = reader.GetSafeInt32(startingIndex++);
            createdByStatus.Name = reader.GetSafeString(startingIndex++);
            createdBy.Status = createdByStatus;
            string createdByRoles = reader.GetSafeString(startingIndex++);
            if (!string.IsNullOrEmpty(createdByRoles))
            {
                createdBy.Role = Newtonsoft.Json.JsonConvert.DeserializeObject<List<LookUp>>(createdByRoles);
            }
            else
            {
                createdBy.Role = new List<LookUp>();
            }
            appointment.CreatedBy = createdBy;
            modifiedBy.UserId = reader.GetSafeInt32(startingIndex++);
            modifiedBy.FirstName = reader.GetSafeString(startingIndex++);
            modifiedBy.MiddleInitial = reader.GetSafeString(startingIndex++);
            modifiedBy.LastName = reader.GetSafeString(startingIndex++);
            modifiedBy.AvatarUrl = reader.GetSafeString(startingIndex++);
            modifiedBy.Email = reader.GetSafeString(startingIndex++);
            modifiedByStatus.Id = reader.GetSafeInt32(startingIndex++);
            modifiedByStatus.Name = reader.GetSafeString(startingIndex++);
            modifiedBy.Status = modifiedByStatus;
            string modifiedByRoles = reader.GetSafeString(startingIndex++);
            if (!string.IsNullOrEmpty(modifiedByRoles))
            {
                modifiedBy.Role = Newtonsoft.Json.JsonConvert.DeserializeObject<List<LookUp>>(modifiedByRoles);
            }
            else
            {
                modifiedBy.Role = new List<LookUp>();
            }
            appointment.ModifiedBy = modifiedBy;

            return appointment;
        }

        private static void AddCommonParams(AppointmentAddRequest appointment, SqlParameterCollection col)
        {
            col.AddWithValue("@AppointmentTypeId", appointment.AppointmentTypeId);
            col.AddWithValue("@ClientId", appointment.ClientId);
            col.AddWithValue("@AttorneyProfileId", appointment.AttorneyProfileId);
            col.AddWithValue("@Notes", appointment.Notes);
            col.AddWithValue("@IsConfirmed", appointment.IsConfirmed);
            col.AddWithValue("@AppointmentStart", appointment.AppointmentStart);
            col.AddWithValue("@AppointmentEnd", appointment.AppointmentEnd);
            col.AddWithValue("@StatusTypesId", appointment.StatusTypesId);
        }








    }
}
