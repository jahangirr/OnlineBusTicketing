using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using JahaTechno.Areas.BTMS.Models;
using System.Web.Http.Cors;

namespace JahaTechno.BTMS.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using BTMS.API.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Booking>("Bookings");
    builder.EntitySet<Schedule>("Schedules"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [EnableCors("*", "*", "*")]
    public class BookingsController : ODataController
    {
        private BusDbContext db = new BusDbContext();

        // GET: odata/Bookings
        [EnableQuery]
        public IQueryable<Booking> GetBookings()
        {
            return db.Bookings;
        }

        // GET: odata/Bookings(5)
        [EnableQuery]
        public SingleResult<Booking> GetBooking([FromODataUri] int key)
        {
            return SingleResult.Create(db.Bookings.Where(booking => booking.BookingId == key));
        }

        // PUT: odata/Bookings(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<Booking> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Booking booking = db.Bookings.Find(key);
            if (booking == null)
            {
                return NotFound();
            }

            patch.Put(booking);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(booking);
        }

        // POST: odata/Bookings
        public IHttpActionResult Post(Booking booking)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Bookings.Add(booking);
            db.SaveChanges();

            return Created(booking);
        }

        // PATCH: odata/Bookings(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Booking> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Booking booking = db.Bookings.Find(key);
            if (booking == null)
            {
                return NotFound();
            }

            patch.Patch(booking);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(booking);
        }

        // DELETE: odata/Bookings(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Booking booking = db.Bookings.Find(key);
            if (booking == null)
            {
                return NotFound();
            }

            db.Bookings.Remove(booking);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Bookings(5)/Schedule
        [EnableQuery]
        public SingleResult<Schedule> GetSchedule([FromODataUri] int key)
        {
            return SingleResult.Create(db.Bookings.Where(m => m.BookingId == key).Select(m => m.Schedule));
        }
        [HttpPost]
        public IHttpActionResult ExSaveBookings(ODataActionParameters parameters)
        {
            var bookings = parameters["bookings"] as IEnumerable<RerservationViewModel>;
            foreach (var bk in bookings)
            {
                db.Bookings.Add(new Booking { CustomerName = bk.CustomerName, MobileNumber = bk.MobileNumber,Address=bk.Address, SeatNumber = bk.SeatNumber.ToString(), ScheduleId = bk.ScheduleId });
            }
            db.SaveChanges();
            return StatusCode(HttpStatusCode.NoContent);
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BookingExists(int key)
        {
            return db.Bookings.Count(e => e.BookingId == key) > 0;
        }
    }
}
