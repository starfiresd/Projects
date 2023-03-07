using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Appointments
{
    public class AppointmentAddRequest
    {
        public int AppointmentTypeId { get; set; }
        public int ClientId { get; set; }
        public int AttorneyProfileId { get; set; }
        public string Notes { get; set; }
        public bool IsConfirmed { get; set; }
        public DateTime AppointmentStart { get; set; }
        public DateTime AppointmentEnd { get; set;}
        public int StatusTypesId { get; set; }
    }
}
