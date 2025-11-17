using System;

namespace App.Server.Models
{
    public class UserSettings
    {
        public long id { get; set; }
        public long user_id { get; set; }
        public string? language { get; set; }
        public string? date_format { get; set; }
        public string? sider_color { get; set; }
        public string? theme { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
    }

    public class UserSettingsRequest
    {
        public long user_id { get; set; }
        public string? language { get; set; }
        public string? date_format { get; set; }
        public string? sider_color { get; set; }
        public string? theme { get; set; }
    }
}
