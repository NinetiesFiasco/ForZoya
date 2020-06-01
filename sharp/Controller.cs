using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace namenamespace.MVC.Address
{
    public class Controller
    {
        public static Answer GetById(object _id)
        {
            int id;
            if (!int.TryParse(_id.ToString(), out id))
                return new Answer(2, "Не верный идентификатор адреса");
            
            return null;
        }

        public static Answer AddressesByClient(object _client)
        {
            Client.Client client = _client as Client.Client;

            return client == null
                ? new Answer(2, "Клиент не инициализирован")
                : Service.AllClientAddresses(client);
        }
    }
}