namespace api.Models;

public class UserRole
{
    public long Id { get; set; }
    public string? RoleName { get; set; }
    public string? Description { get; set; }
    public DateTime? CreatedDate { get; set; }
}
