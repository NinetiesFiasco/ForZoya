using sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace namenamespace.MVC.Address
{
    public class Service
    {
        public static Answer get(int id)
        {
            Dictionary<string, string> dic = new siteSql(@"SELECT * FROM adresTable WHERE id = @id", 'o', new[] { "@id", id.ToString() }, true).getFStringDic();
            if (dic == null)
                return new Answer(0, "Адрес не найден");

            return new Answer(1, "ОК", new Address(dic));
        }

        public static Answer AllClientAddresses(Client.Client client)
        {
            DataSet ds = new siteSql(@"SELECT * FROM adresTable WHERE clientId = @clientId", 'o', new[] { "@clientId", client.id.ToString() }, true).getDS();

            if (ds == null)
                return new Answer(0, "Адреса не найдены");

            List<Address> addresses = new List<Address>();
            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)            
                addresses.Add(new Address(ds.Tables[0].Rows[i]));

            return new Answer(1, "ОК", addresses);
        }
    }
}