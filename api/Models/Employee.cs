using System;

namespace App.Server.Models
{
    public class Employee
    {
        public long Id { get; set; }
        public string? EmployeeNumber { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? DomainUsername { get; set; }
        public string? Department { get; set; }
        public string? JobTitle { get; set; }
        public string? PhoneNumber { get; set; }
        public string? PhotoURL { get; set; }
        public long? ManagerId { get; set; }
        public string? ManagerName { get; set; }  // From JOIN
        public DateTime? HireDate { get; set; }
        public DateTime? TerminationDate { get; set; }
        public string? EmployeeStatus { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
