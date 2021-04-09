using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace JahaTechno.Areas.BTMS.Models
{
    public enum BusType
    {
        AC, NonAC
    }
    public class BusRoute
    {

        public int BusRouteId { get; set; }
        [Required]
        public string From { get; set; }
        [Required]
        public string To { get; set; }
        public virtual IList<Schedule> Schedules { get; set; }

    }
    public class Bus
    {

        public int BusId { get; set; }

        [Required]
        public string CoachNo { get; set; }


        [Required, Column(TypeName = "money")]
        public decimal Fare { get; set; }
        public BusType BusType { get; set; }


        //public int SeatAvailable { get; set; }
        public virtual IList<Schedule> Schedules { get; set; }

    }
    public class Schedule
    {

        public int ScheduleId { get; set; }
        [Required]
        public DateTime DepartDateTime { get; set; }

        //Navigation ForeignKey

        [ForeignKey("BusRoute")]
        public int BusRouteId { get; set; }
        public virtual BusRoute BusRoute { get; set; }
        //Navigation ForeignKey
        [ForeignKey("Bus")]
        public int BusId { get; set; }
        public virtual Bus Bus { get; set; }
        public virtual IList<Booking> Bookings { get; set; }
    }
    public class Booking
    {

        public int BookingId { get; set; }
        [Required, StringLength(60)]
        public string CustomerName { get; set; }
        [Required]
        public string MobileNumber { get; set; }
        //public string Email { get; set; }


        [Required]
        public string Address { get; set; }

        public string SeatNumber { get; set; }
        //Navigation ForeignKey
        [Required, ForeignKey("Schedule")]
        public int ScheduleId { get; set; }
        public virtual Schedule Schedule { get; set; }
    }
    public class BusDbContext : DbContext
    {
        public BusDbContext() : base("name=BussDbContext")
        {

        }

        public DbSet<BusRoute> BusRoutes { get; set; }
        public DbSet<Bus> Buses { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Booking> Bookings { get; set; }

    }
}