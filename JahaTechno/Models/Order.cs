using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JahaTechno.Models
{
    public class Order
    {

        public int orderId { set; get; }

        public string name { set; get; }
        public string cell { set; get; }
        public string email { set; get; }

        public string skypeAddress { set; get; }

        public string imoAddress { set; get; }

        public string description { set; get; }
        public int numberOfDays { set; get; }
        public int budget { set; get; }
        public string budgetCurrency { set; get; }


    }
}


 