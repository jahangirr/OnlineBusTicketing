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
    builder.EntitySet<BusRoute>("BusRoutes");
    builder.EntitySet<Schedule>("Schedules"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [EnableCors("*", "*", "*")]
    [Authorize]
    public class BusRoutesController : ODataController
    {
        private BusDbContext db = new BusDbContext();

        // GET: odata/BusRoutes
        [EnableQuery]
        [AllowAnonymous]
        public IQueryable<BusRoute> GetBusRoutes()
        {
            return db.BusRoutes;
        }

        // GET: odata/BusRoutes(5)
        [EnableQuery]
        [AllowAnonymous]
        public SingleResult<BusRoute> GetBusRoute([FromODataUri] int key)
        {
            return SingleResult.Create(db.BusRoutes.Where(busRoute => busRoute.BusRouteId == key));
        }

        // PUT: odata/BusRoutes(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<BusRoute> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BusRoute busRoute = db.BusRoutes.Find(key);
            if (busRoute == null)
            {
                return NotFound();
            }

            patch.Put(busRoute);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusRouteExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(busRoute);
        }

        // POST: odata/BusRoutes
        public IHttpActionResult Post(BusRoute busRoute)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (db.BusRoutes.Count(br => br.From.ToLower() == busRoute.From.ToLower() && br.To.ToLower() == busRoute.To.ToLower()) > 0)
            {
                return BadRequest("Bus route already exits");
            }
            db.BusRoutes.Add(busRoute);
            db.SaveChanges();

            return Created(busRoute);
        }

        // PATCH: odata/BusRoutes(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<BusRoute> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BusRoute busRoute = db.BusRoutes.Find(key);
            if (busRoute == null)
            {
                return NotFound();
            }

            patch.Patch(busRoute);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusRouteExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(busRoute);
        }

        // DELETE: odata/BusRoutes(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            BusRoute busRoute = db.BusRoutes.Find(key);
            if (busRoute == null)
            {
                return NotFound();
            }

            db.BusRoutes.Remove(busRoute);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/BusRoutes(5)/Schedules
        [EnableQuery]
        public IQueryable<Schedule> GetSchedules([FromODataUri] int key)
        {
            return db.BusRoutes.Where(m => m.BusRouteId == key).SelectMany(m => m.Schedules);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BusRouteExists(int key)
        {
            return db.BusRoutes.Count(e => e.BusRouteId == key) > 0;
        }
    }
}
