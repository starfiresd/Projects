using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Migrately.Models.Requests.Appointments
{
    public class AppointmentUpdateRequest : AppointmentAddRequest, IModelIdentifier
    {
        public int Id {get; set;}
    }
}
