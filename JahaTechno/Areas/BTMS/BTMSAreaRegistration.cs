using System.Web.Mvc;

namespace JahaTechno.Areas.BTMS
{
    public class BTMSAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "BTMS";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "BTMS_default",
                "BTMS/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional },
                namespaces: new[] { "JahaTechno.Areas.BTMS.Controllers" }
            );
        }
    }
}