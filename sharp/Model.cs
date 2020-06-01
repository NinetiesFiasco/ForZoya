using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using sql;

namespace namenamespace.MVC.Address
{
    public class Address : ModelTools
    {
        public Dictionary<string, string> sqlData;
        public int id;
        private int idClient, zamerDist, dostavkaDist, region, partner, polygon;
        private float mkadDist, sBettonRingDist, kadDist;
        private bool domofon,liftGruz, liftPassenger;
        private string 
            komment, postindex,
            oblast, gorod, ulica, metro,
            dom, corpus, podezd, etaj, kvartira,
            domofoncod,
            coords, computedCoords,
            story, 
            yaAdres, KADrasp;
        public Address(DataRow r):this(siteSql.rowToStringDictionary(r)){}
        public Address(Dictionary<string,string> d)
        {
            sqlData = d;
            
            id = openInt(d["id"]);            
            idClient = openInt(d["idClient"]);
            zamerDist = openInt(d["zamerDist"]);
            region = openInt(d["region"]);
            partner = openInt(d["partner"]);
            dostavkaDist = openInt(d["dostavkaDist"]);
            polygon = openInt(d["polygon"]);

            domofon = openBool(d["domofon"]);
            liftGruz = openBool(d["liftGruz"]);
            liftPassenger = openBool(d["liftPassenger"]);

            mkadDist = openFloat(d["mkadDist"]);
            sBettonRingDist = openFloat(d["sBettonRingDist"]);
            kadDist = openFloat(d["kadDist"]);

            komment = d["komment"];
            postindex = d["postindex"];
            oblast = d["oblast"];
            gorod = d["gorod"];
            ulica = d["ulica"];
            metro = d["metro"];
            dom = d["dom"];
            corpus = d["corpus"];
            podezd = d["podezd"];
            etaj = d["etaj"];
            kvartira = d["kvartira"];
            domofoncod = d["domofoncod"];
            coords = d["coords"];
            computedCoords = d["computedCoords"];
            story = d["story"];
            yaAdres = d["yaAdres"];
            KADrasp = d["KADrasp"];
        }

        private string FullAddressString = "";
        private void descFirst(string part, string desc)
        {
            if (part.Length == 0) return;
            addComma();
            if (part.Length > 0)
                FullAddressString += desc + " " + part;
        }
        private void addComma()
        {
            if (FullAddressString.Length > 0) FullAddressString += ", ";
        }

        // Имеет смысл перетащить это во Вьюшку
        public string defaultLine()
        {
            FullAddressString="";
            if (sqlData["oblast"].Length != 0)
                FullAddressString += sqlData["oblast"] + " обл.";

            string[] arr = {
                sqlData["gorod"],"",
                sqlData["metro"], "м.",
                sqlData["ulica"], "ул.",
                sqlData["dom"], "дом",
                sqlData["corpus"], "корп.",
                sqlData["kvartira"], "кв.",
                sqlData["podezd"], "подъезд",
                sqlData["etaj"], "этаж"
            };
            for (int i = 0; i < arr.Length; i += 2)
                descFirst(arr[i], arr[i + 1]);


            if (bool.Parse(sqlData["domofon"].ToString()))
            {
                addComma();
                FullAddressString += "домофон: да";

                if (sqlData["domofoncod"].Length > 0)
                {
                    addComma();
                    FullAddressString += " код " + sqlData["domofoncod"];
                }
            }
            return FullAddressString;
        }
    }
}
