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
    builder.EntitySet<Schedule>("Schedules");
    builder.EntitySet<Booking>("Bookings"); 
    builder.EntitySet<Bus>("Buses"); 
    builder.EntitySet<BusRoute>("BusRoutes"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [EnableCors("*", "*", "*")]
    [Authorize]
    public class SchedulesController : ODataController
    {
        private BusDbContext db = new BusDbContext();

        // GET: odata/Schedules
        [EnableQuery]
        [AllowAnonymous]
        public IQueryable<Schedule> GetSchedules()
        {
            string ss = "";

            var sche = db.Schedules;
            foreach(var s in sche)
            {
                ss = s.DepartDateTime.ToString();
            }
            return db.Schedules;
        }

        // GET: odata/Schedules(5)
        [EnableQuery]
        [AllowAnonymous]
        public SingleResult<Schedule> GetSchedule([FromODataUri] int key)
        {
            return SingleResult.Create(db.Schedules.Where(schedule => schedule.ScheduleId == key));
        }

        // PUT: odata/Schedules(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<Schedule> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Schedule schedule = db.Schedules.Find(key);
            if (schedule == null)
            {
                return NotFound();
            }

            patch.Put(schedule);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScheduleExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(schedule);
        }

        // POST: odata/Schedules
        public IHttpActionResult Post(Schedule schedule)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Schedules.Add(schedule);
            db.SaveChanges();

            return Created(schedule);
        }

        // PATCH: odata/Schedules(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Schedule> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Schedule schedule = db.Schedules.Find(key);
            if (schedule == null)
            {
                return NotFound();
            }

            patch.Patch(schedule);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScheduleExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(schedule);
        }

        // DELETE: odata/Schedules(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Schedule schedule = db.Schedules.Find(key);
            if (schedule == null)
            {
                return NotFound();
            }

            db.Schedules.Remove(schedule);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Schedules(5)/Bookings
        [EnableQuery]
        public IQueryable<Booking> GetBookings([FromODataUri] int key)
        {
            return db.Schedules.Where(m => m.ScheduleId == key).SelectMany(m => m.Bookings);
        }

        // GET: odata/Schedules(5)/Bus
        [EnableQuery]
        public SingleResult<Bus> GetBus([FromODataUri] int key)
        {
            return SingleResult.Create(db.Schedules.Where(m => m.ScheduleId == key).Select(m => m.Bus));
        }

        // GET: odata/Schedules(5)/BusRoute
        [EnableQuery]
        public SingleResult<BusRoute> GetBusRoute([FromODataUri] int key)
        {
            return SingleResult.Create(db.Schedules.Where(m => m.ScheduleId == key).Select(m => m.BusRoute));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ScheduleExists(int key)
        {
            return db.Schedules.Count(e => e.ScheduleId == key) > 0;
        }
    }
}
