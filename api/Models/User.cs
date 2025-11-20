using System;

namespace App.Server.Models
{
    public class User
    {
        public long id { get; set; }
        public string? name { get; set; }
        public string? username { get; set; }
        public string? email { get; set; }
        public string? user_status { get; set; }
        public DateTime? last_active_time { get; set; }
        public long? role_id { get; set; }
        public string? role { get; set; }  // RoleName from JOIN
    }
}