using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace namenamespace.MVC.Address
{
    public class View
    {
        public static string AddressesBlock(object _addresses)
        {
            List<Address> addresses = _addresses as List<Address>;

            if (addresses == null) return "Адреса отсутствуют";

            string html = "<ul>";
            for (int i = 0; i < addresses.Count; i++)
                html += "<li data-id='" + addresses[i].id+ @"'>" + addresses[i].defaultLine()+"</li>";
            html += "</ul>";
            return html;

        }
    }
}