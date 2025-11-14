using System;

namespace App.Server.Models
{
    public class User
    {
        public long id { get; set; }
        public string? name { get; set; }
        public string? username { get; set; }
        public string? email { get; set; }
        public string? password_hash { get; set; }
        public string? user_status { get; set; }
        public DateTime? open_date { get; set; }
        public DateTime? close_date { get; set; }
    }
}