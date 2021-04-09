using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JahaTechno.Areas.BTMS.Models
{
    public class BusViewModel
    {
        public int BusId { get; set; }

        public int TotalSeats { get; set; }
        public int ScheduleId { get; set; }
        public decimal Fare { get; set; }
        public List<BookingViewModel> Bookings { get; set; }
    }
    public class BookingViewModel
    {
        public int BookingId { get; set; }
        public string SeatNumber { get; set; }

    }
    public class RerservationViewModel
    {
        public string CustomerName { get; set; }

        public string MobileNumber { get; set; }
        //public string Email { get; set; }



        public string Address { get; set; }

        public int SeatNumber { get; set; }

        public int ScheduleId { get; set; }
    }
}