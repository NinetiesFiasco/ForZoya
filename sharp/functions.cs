
        // Поcлать СМС
        public static Answer SendSMS(string tel, string message)
        {
            string tmp = Regex.Replace(tel, @"^[+]?[7|8]?[-]?[(]?(\d\d\d)[)]?-?(\d\d\d)-?(\d\d)-?(\d\d)$", @"$1$2$3$4");
            if (!Regex.IsMatch(tmp, @"^\d{10}$"))
            {
                return new Answer(0, "Указанный телефон не соответствует формату", tel + " - не соответствует формату");
            }

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("https://beeline.amega-inform.ru/sms_send/");
            request.Method = "POST";
            request.Credentials = CredentialCache.DefaultCredentials;

            string postedData = @"user=" + SMSLogin + "&pass=" + SMSPassword + "&action=post_sms&message=" + message + "&target=+7" + tel;

            UTF8Encoding encoding = new UTF8Encoding();
            var bytes = encoding.GetBytes(postedData);

            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = bytes.Length;

            using (var newStream = request.GetRequestStream())
            {
                newStream.Write(bytes, 0, bytes.Length);
                newStream.Close();
            }
            try
            {
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();

                using (Stream rspStm = response.GetResponseStream())
                using (GZipStream decompressionStream = new GZipStream(rspStm, CompressionMode.Decompress))
                {
                    const int bufferSize = 4096;
                    int bytesRead = 0;

                    byte[] buffer = new byte[bufferSize];

                    using (MemoryStream ms = new MemoryStream())
                    {
                        while ((bytesRead = decompressionStream.Read(buffer, 0, bufferSize)) > 0)
                        {
                            ms.Write(buffer, 0, bytesRead);
                        }

                        Answer answer = new Answer(0, "", "");
                        XDocument xd = XDocument.Parse(Encoding.UTF8.GetString(ms.ToArray()));
                        List<XElement> messages = null;
                        try
                        {
                            messages = xd.Element("output").Element("result").Elements("sms").ToList();
                        }
                        catch { answer.errors.Add("Ошибка чтения XML messages"); }

                        if (messages != null)
                            for (int i = 0; i < messages.Count; i++)
                                if (messages[i].Attribute("id") != null && messages[i].Attribute("phone") != null)
                                    answer.sms.Add(new SMSdesc(messages[i].Attribute("id").Value, messages[i].Attribute("phone").Value, message));

                        List<XElement> errs = null;
                        string errorNode = "";
                        try
                        {
                            errs = xd.Element("output").Element("errors").Elements("error").ToList();
                        }
                        catch { errorNode = "Ошибки отсутствуют"; }

                        if (errs != null)
                            for (int i = 0; i < errs.Count; i++)
                                answer.errors.Add(errs[i].Value);

                        answer.success = 1;
                        answer.message = "Запрос отправлен, ответ получен. " + errorNode;
                        return answer;
                    }
                }
            }
            catch (WebException ex)
            {
                return new Answer(0, "Ошибка", ex.Message);
            }
        }


        /*
Для добавления изображений использовать класс Attachment 
        */
        public static Answer SendEmail(string email, string title, string message,string copyMails, IList<HttpPostedFile> postFiles)
        {
            SmtpClient cl = new SmtpClient()
            {
                Host = IP,
                Port = Port,
                EnableSsl = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new System.Net.NetworkCredential()
                {
                    UserName = UserName,
                    Password = Password
                }
            };

            MailMessage mail = new MailMessage()
            {
                IsBodyHtml = true,
                From = new MailAddress("any@mail.com", "Fabric «nice furniture»"),
                Subject = title,
                Body = message
            };

            mail.To.Add(email);

            if (copyMails != "")
            {
                string[] mails = copyMails.Split(';');
                int len = mails.Length - 1;
                for (int i = 0; i < len; i++)
                {
                    if (mails[i] != "")
                        mail.CC.Add(mails[i].Trim());
                }
            }

            for (int i = 0; i < postFiles.Count; i++)
            {                
                Attachment attach = new Attachment(postFiles[i].InputStream, Path.GetFileName(postFiles[i].FileName));
                mail.Attachments.Add(attach);
            }

            cl.Send(mail);
            cl.Dispose();
            return new Answer(1, "Все чудесно. Отправлено " + DateTime.Now.ToString("dd.MM.yyyy hh:mm:ss"));
        }
    }