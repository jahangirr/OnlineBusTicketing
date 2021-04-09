using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using JahaTechno.Models;
using System.Net.Mail;
using System.IO;
using System.Net.Mime;

namespace JahaTechno.Controllers
{
    public class OrdersController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [HttpPost]
        public string OrderPost( Order order)
        {

            string returnString = "";

            MailMessage mail = new MailMessage();
            mail.From = new MailAddress(order.email.ToString());
            mail.To.Add("ToWhom@gmail.com");
            mail.IsBodyHtml = true;
            mail.Subject = order.cell + "_"+DateTime.Now.ToString()+"_Order";

            string mBody = "Name : " + order.name + " <br/> <br/>"; 
            mBody += " Cell : " + order.cell + "<br/><br/>";
            mBody += " Email : " + order.email + "<br/><br/>";

            mBody += " skype : " + order.skypeAddress + "<br/><br/>";
            mBody += " imo : " + order.imoAddress + "<br/><br/>";

            mBody += " Days : " + order.numberOfDays.ToString() + "<br/><br/>";
            mBody += " Budget : " + order.budgetCurrency.ToString()+" "+ order.budget.ToString() + "<br/><br/>";
            mBody += " Description : " + order.description;

            mail.Body = mBody;


            // Add a carbon copy recipient.
            MailAddress copy = new MailAddress("ToWhomCopy@gmail.com");
            mail.CC.Add(copy);


            var saveToFileLoc = Server.MapPath("~/Images");
            


            string[] dirs = Directory.GetFiles(saveToFileLoc, order.cell.ToString() + "*");
            foreach (string dir in dirs)
            {
                // Create  the file attachment for this e-mail message.
                Attachment data = new Attachment(dir, MediaTypeNames.Application.Octet);
                // Add time stamp information for the file.
                ContentDisposition disposition = data.ContentDisposition;
                disposition.CreationDate = System.IO.File.GetCreationTime(dir);
                disposition.ModificationDate = System.IO.File.GetLastWriteTime(dir);
                disposition.ReadDate = System.IO.File.GetLastAccessTime(dir);
                // Add the file attachment to this e-mail message.
                mail.Attachments.Add(data);
            }
            SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
            smtp.UseDefaultCredentials = false;

            //To test sending emails through SMTP, you can use your Gmail account or sign up for a new one
            // .To use Google's SMTP servers, you will need to enable 
            // Less secure app access on your profile's Security page:

            smtp.Credentials = new System.Net.NetworkCredential("ByWhom@gmail.com", "password");


            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtp.EnableSsl = false;

            smtp.Timeout = 30000;
            try
            {

                smtp.Send(mail);
                mail.Dispose();

                string[] dirsDel = Directory.GetFiles(saveToFileLoc, order.cell.ToString() + "*");
                foreach (string dirdel in dirsDel)
                {
                    try
                    {
                        System.IO.File.Delete(dirdel);
                    }
                    catch (Exception ex)
                    {
                        returnString = "File Deleting zone : "+ ex.Message.ToString();
                    }
                }

            }
            catch (SmtpException e)
            {

                returnString = "SMTP sending "+ e.Message;
                
            }

            return returnString;



        }

       

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
