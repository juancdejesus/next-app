using System;

namespace App.Server.Models
{
    public class User
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? PhotoURL { get; set; }
        public string? UserStatus { get; set; }
        public DateTime? LastActiveTime { get; set; }
        public long? RoleId { get; set; }
        public string? Role { get; set; }  // RoleName from JOIN
    }
}