using Sabio.Models;
using Sabio.Models.Domain.Appointments;
using Sabio.Models.Requests.Appointments;

namespace Sabio.Services.Interfaces
{
    public interface IAppointmentService
    {
        Appointment GetById(int id);
        public Paged<Appointment> GetByClientId(int clientId, int pageIndex, int pageSize);
        public Paged<Appointment> GetByAttorneyId(int attorneyProfileId, int pageIndex, int pageSize);
        public Paged<Appointment> GetByCreatedById(int createdById, int pageIndex, int pageSize);
        public int Add(AppointmentAddRequest user, int userId);
        public void Update(AppointmentUpdateRequest appointment, int userId);
        public void Delete(int id);
    }
}