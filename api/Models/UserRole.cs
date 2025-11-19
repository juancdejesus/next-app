namespace api.Models;

public class UserRole
{
    public long id { get; set; }
    public string? role_name { get; set; }
    public string? description { get; set; }
    public DateTime? created_date { get; set; }
}
