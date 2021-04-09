using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using System.Web.Http.OData.Builder;
using JahaTechno.Areas.BTMS.Models;
using System.Web.Http.OData.Extensions;




namespace JahaTechno
{
    public static class WebApiConfig
    {
        //http://www.asp.net/web-api/overview/web-api-routing-and-actions/routing-in-aspnet-web-api
        public static void Register(HttpConfiguration config)
        {
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            config.EnableCors();

          

            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            // config.SuppressDefaultHostAuthentication();
            // config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            // Web API routes
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute(
              name: "DefaultApi",
              routeTemplate: "api/{controller}/{id}",
              defaults: new { id = RouteParameter.Optional }
          );

            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();

            builder.EntitySet<BusRoute>("BusRoutes");
            builder.EntitySet<Schedule>("Schedules");
            builder.EntitySet<Booking>("Bookings");
            builder.EntitySet<Bus>("Buses");

            //bound action
            //builder.Action("ExGetRouteFrom").ReturnsCollection<string>();

            builder.Entity<Bus>().Collection.Action("ExGetRouteFrom").ReturnsCollection<string>();

            var acrt = builder.Entity<Bus>().Collection.Action("ExGetRouteTo").ReturnsCollection<string>();
            acrt.Parameter<string>("from");
            var acbs = builder.Entity<Bus>().Collection.Action("ExGetBusInfo").Returns<BusViewModel>();
            acbs.Parameter<int>("id");

            var acbk = builder.Entity<Booking>().Collection.Action("ExSaveBookings").Returns<bool>();
            acbk.CollectionParameter<RerservationViewModel>("bookings");

            config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
        }
    }
}
