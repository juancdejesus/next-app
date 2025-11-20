using System;

namespace App.Server.Models
{
    public class UserSettings
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string? Language { get; set; }
        public string? DateFormat { get; set; }
        public string? SiderColor { get; set; }
        public string? Theme { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }

    public class UserSettingsRequest
    {
        public long UserId { get; set; }
        public string? Language { get; set; }
        public string? DateFormat { get; set; }
        public string? SiderColor { get; set; }
        public string? Theme { get; set; }
    }
}
