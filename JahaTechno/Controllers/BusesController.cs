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
    builder.EntitySet<Bus>("Buses");
    builder.EntitySet<Schedule>("Schedules"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [EnableCors("*", "*", "*")]
    [Authorize]
    public class BusesController : ODataController
    {
        private BusDbContext db = new BusDbContext();

        // GET: odata/Buses
        [EnableQuery]
        [AllowAnonymous]
        public IQueryable<Bus> GetBuses()
        {

            int chack = db.Buses.Select(e => e.BusId > 0).Count();
            return db.Buses;
        }

        // GET: odata/Buses(5)
        [EnableQuery]
        [AllowAnonymous]
        
        public SingleResult<Bus> GetBus([FromODataUri] int key)
        {
            return SingleResult.Create(db.Buses.Where(bus => bus.BusId == key));
        }

        // PUT: odata/Buses(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<Bus> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Bus bus = db.Buses.Find(key);
            if (bus == null)
            {
                return NotFound();
            }

            patch.Put(bus);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(bus);
        }

        // POST: odata/Buses
        public IHttpActionResult Post(Bus bus)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Buses.Add(bus);
            db.SaveChanges();

            return Created(bus);
        }

        // PATCH: odata/Buses(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Bus> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Bus bus = db.Buses.Find(key);
            if (bus == null)
            {
                return NotFound();
            }

            patch.Patch(bus);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(bus);
        }

        // DELETE: odata/Buses(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Bus bus = db.Buses.Find(key);
            if (bus == null)
            {
                return NotFound();
            }

            db.Buses.Remove(bus);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Buses(5)/Schedules
        [EnableQuery]
        public IQueryable<Schedule> GetSchedules([FromODataUri] int key)
        {
            return db.Buses.Where(m => m.BusId == key).SelectMany(m => m.Schedules);
        }


        [AllowAnonymous]
        [HttpPost]
        //[ODataRoute("Nums")]
        //[Route("ExGetRouteFrom")]
        public IList<string> ExGetRouteFrom()
        {
            return db.BusRoutes.Select(r => r.From).Distinct().ToList();
        }
        [AllowAnonymous]
        [HttpPost]
        //[ODataRoute("Nums")]

        public IList<string> ExGetRouteTo(ODataActionParameters parameters)
        {
            var from = (string)parameters["from"];
            return db.BusRoutes.Where(r => r.From == from).Select(r => r.To).Distinct().ToList();
        }

        
        [AllowAnonymous]
        [HttpPost]
        public BusViewModel ExGetBusInfo(ODataActionParameters parameters)
        {
            int id = (int)parameters["id"];
            var sch = db.Schedules.Include("Bookings").First(s => s.ScheduleId == id);
            var bus= db.Buses.First(b => b.BusId == sch.BusId);
            return new BusViewModel { BusId = bus.BusId, ScheduleId = sch.ScheduleId, TotalSeats = 40,Fare=bus.Fare, Bookings=sch.Bookings.Select(s=> new BookingViewModel{ BookingId=s.BookingId, SeatNumber=s.SeatNumber}).ToList() };
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BusExists(int key)
        {
            return db.Buses.Count(e => e.BusId == key) > 0;
        }
    }
}
