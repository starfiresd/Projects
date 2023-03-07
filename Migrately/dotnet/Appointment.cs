using Sabio.Models.Domain.Attorneys;
using Sabio.Models.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Appointments
{
    public class Appointment
    {
        public int Id { get; set; }
        public LookUp AppointmentType { get; set; }
        public User Client { get; set; }
        public Attorney AttorneyProfile { get; set; }
        public string Notes { get; set; }
        public bool IsConfirmed { get; set; }
        public DateTime AppointmentStart { get; set; }
        public DateTime AppointmentEnd { get; set; }
        public LookUp Status { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public User CreatedBy { get; set; }
        public User ModifiedBy { get; set;}
    }
}