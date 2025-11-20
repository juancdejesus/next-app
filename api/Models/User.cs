using System;

namespace App.Server.Models
{
    public class User
    {
        public long Id { get; set; }
        public long EmployeeId { get; set; }
        public long? RoleId { get; set; }
        public string? UserStatus { get; set; }
        public DateTime? LastActiveTime { get; set; }
        public DateTime? LastLoginTime { get; set; }
        public DateTime? AccountCreatedDate { get; set; }

        // Employee fields (from JOIN - read-only)
        public string? EmployeeNumber { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Name { get; set; }  // FullName from Employee
        public string? Username { get; set; }  // DomainUsername from Employee
        public string? Email { get; set; }
        public string? PhotoURL { get; set; }
        public string? Department { get; set; }
        public string? JobTitle { get; set; }

        // Role (from JOIN)
        public string? Role { get; set; }
    }
}