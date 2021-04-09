using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JahaTechno.Controllers
{
    public class OrderFileUploadController : Controller
    {
        // GET: OrderFileUpload
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public virtual string UploadFiles(object obj)
        {
            var length = Request.ContentLength;
            var bytes = new byte[length];
            Request.InputStream.Read(bytes, 0, length);

            var fileName = Request.Headers["X-File-Name"];
            var fileSize = Request.Headers["X-File-Size"];
            var fileType = Request.Headers["X-File-Type"];

            var saveToFileLoc = Server.MapPath("~/Images/") + fileName;


            try
            {

                // save the file.
                var fileStream = new FileStream(saveToFileLoc, FileMode.Create, FileAccess.ReadWrite);
                fileStream.Write(bytes, 0, length);
                fileStream.Close();
            }
            catch (Exception ex)
            {

                string extempc = ex.Message;
            }


            return string.Format("{0} bytes uploaded", bytes.Length);
        }


        [HttpPost]
        public virtual string DeleteFile(string fileName)
        {

            var saveToFileLoc = Server.MapPath("~/Images/") + fileName;


            try
            {

                System.IO.File.Delete(saveToFileLoc);
               
            }
            catch (Exception ex)
            {

                string errorMassage = ex.Message;
            }


            return string.Format("{0} Filr", "Deleted");
        }
    }
}