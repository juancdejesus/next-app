-- Create the database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'DataHub')
BEGIN
    CREATE DATABASE DataHub;
END
GO

USE DataHub;
GO

-- ==============================================================
-- DROP ALL EXISTING OBJECTS
-- ==============================================================

-- Drop all stored procedures

-- Employee procedures
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Employees_Update]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[Employees_Update];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Employees_Add]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[Employees_Add];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Employees_Get]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[Employees_Get];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Employees_GetWithoutUserAccess]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[Employees_GetWithoutUserAccess];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Employees_GetList]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[Employees_GetList];
GO

-- User/UserSettings procedures
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserSettings_Upsert]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[UserSettings_Upsert];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserSettings_Get]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[UserSettings_Get];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserRoles_GetList]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[UserRoles_GetList];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Activate]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_Activate];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Update]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_Update];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Inactivate]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_Inactivate];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Delete]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_Delete];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Add]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_Add];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_GetByDomainUsername]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_GetByDomainUsername];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_GetByUsernameOrEmail]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_GetByUsernameOrEmail];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Get]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_Get];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_GetList]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_GetList];
GO

-- Drop all tables (in correct order to respect foreign keys)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserSettings]') AND type in (N'U'))
    DROP TABLE [dbo].[UserSettings];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User]') AND type in (N'U'))
    DROP TABLE [dbo].[User];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Employees]') AND type in (N'U'))
    DROP TABLE [dbo].[Employees];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserRoles]') AND type in (N'U'))
    DROP TABLE [dbo].[UserRoles];
GO

-- ==============================================================
-- CREATE ALL TABLES
-- ==============================================================

-- ==============================================================
-- Table: UserRoles
-- ==============================================================
CREATE TABLE [dbo].[UserRoles] (
    Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(200) NULL,
    CreatedDate DATETIME2 NULL DEFAULT GETDATE()
);
GO

-- Insert default roles
INSERT INTO [UserRoles] (RoleName, Description, CreatedDate) VALUES ('Admin', 'System Administrator with full access', GETDATE());
INSERT INTO [UserRoles] (RoleName, Description, CreatedDate) VALUES ('Manager', 'Manager with elevated permissions', GETDATE());
INSERT INTO [UserRoles] (RoleName, Description, CreatedDate) VALUES ('User', 'Standard user with basic permissions', GETDATE());
INSERT INTO [UserRoles] (RoleName, Description, CreatedDate) VALUES ('Viewer', 'Read-only access user', GETDATE());
GO

-- ==============================================================
-- Table: Employees (Master employee registry)
-- ==============================================================
CREATE TABLE [dbo].[Employees] (
    Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    EmployeeNumber NVARCHAR(50) NOT NULL UNIQUE,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    FullName NVARCHAR(200) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    DomainUsername NVARCHAR(100) NULL,
    Department NVARCHAR(100) NULL,
    JobTitle NVARCHAR(100) NULL,
    PhoneNumber NVARCHAR(50) NULL,
    PhotoURL NVARCHAR(500) NULL,
    ManagerId BIGINT NULL,
    HireDate DATE NULL,
    TerminationDate DATE NULL,
    EmployeeStatus NVARCHAR(10) NOT NULL DEFAULT 'A',
    CreatedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedDate DATETIME2 NULL,
    CONSTRAINT FK_Employees_Manager FOREIGN KEY (ManagerId) REFERENCES [Employees](Id)
);
GO

-- Create indexes for faster lookups
CREATE INDEX IX_Employees_Email ON [Employees](Email);
CREATE INDEX IX_Employees_DomainUsername ON [Employees](DomainUsername);
CREATE INDEX IX_Employees_Status ON [Employees](EmployeeStatus);
CREATE INDEX IX_Employees_ManagerId ON [Employees](ManagerId);
GO

-- ==============================================================
-- Table: User (System access control)
-- ==============================================================
CREATE TABLE [dbo].[User] (
    Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    EmployeeId BIGINT NOT NULL,
    RoleId BIGINT NULL,
    UserStatus NVARCHAR(10) NULL DEFAULT 'A',
    LastActiveTime DATETIME2 NULL DEFAULT GETDATE(),
    LastLoginTime DATETIME2 NULL,
    AccountCreatedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    AccountCreatedBy BIGINT NULL,
    AccountModifiedDate DATETIME2 NULL,
    AccountModifiedBy BIGINT NULL,
    CONSTRAINT FK_User_Employees FOREIGN KEY (EmployeeId) REFERENCES [Employees](Id) ON DELETE CASCADE,
    CONSTRAINT FK_User_UserRoles FOREIGN KEY (RoleId) REFERENCES [UserRoles](Id),
    CONSTRAINT UQ_User_EmployeeId UNIQUE (EmployeeId)
);
GO

-- Create indexes
CREATE INDEX IX_User_EmployeeId ON [User](EmployeeId);
CREATE INDEX IX_User_RoleId ON [User](RoleId);
CREATE INDEX IX_User_Status ON [User](UserStatus);
GO

-- ==============================================================
-- SEED DATA: Insert initial employees and users
-- ==============================================================

-- Insert employees first
INSERT INTO [Employees] (EmployeeNumber, FirstName, LastName, FullName, Email, DomainUsername, Department, JobTitle, PhotoURL, EmployeeStatus)
VALUES ('E001', 'Juan', 'De Jesus', 'Juan De Jesus', 'juanc@test.com', 'MATRIX\juanc', 'IT', 'Developer', 'https://randomuser.me/api/portraits/men/80.jpg', 'A');

INSERT INTO [Employees] (EmployeeNumber, FirstName, LastName, FullName, Email, DomainUsername, Department, JobTitle, PhotoURL, EmployeeStatus)
VALUES ('E002', 'Jose', 'Perez', 'Jose Perez', 'jperez@test.com', 'MATRIX\jperez', 'IT', 'Senior Developer', 'https://randomuser.me/api/portraits/men/81.jpg', 'A');

INSERT INTO [Employees] (EmployeeNumber, FirstName, LastName, FullName, Email, DomainUsername, Department, JobTitle, PhotoURL, EmployeeStatus)
VALUES ('E003', 'Jose', 'Ramirez', 'Jose Ramirez', 'jramirez@test.com', 'MATRIX\jramirez', 'Operations', 'Operator', 'https://randomuser.me/api/portraits/men/74.jpg', 'A');

INSERT INTO [Employees] (EmployeeNumber, FirstName, LastName, FullName, Email, DomainUsername, Department, JobTitle, PhotoURL, EmployeeStatus)
VALUES ('E004', 'Josue', 'Castellanos', 'Josue Castellanos', 'jcastellanos@example.com', 'MATRIX\jcastellanos', 'Finance', 'Analyst', 'https://randomuser.me/api/portraits/men/75.jpg', 'A');

INSERT INTO [Employees] (EmployeeNumber, FirstName, LastName, FullName, Email, DomainUsername, Department, JobTitle, PhotoURL, EmployeeStatus)
VALUES ('E005', 'Pedro', 'Martinez', 'Pedro Martinez', 'pedro@example.com', 'MATRIX\pmartinez', 'Operations', 'Manager', 'https://randomuser.me/api/portraits/men/79.jpg', 'A');

INSERT INTO [Employees] (EmployeeNumber, FirstName, LastName, FullName, Email, DomainUsername, Department, JobTitle, PhotoURL, EmployeeStatus)
VALUES ('E006', 'Carlos', 'Bautista', 'Carlos Bautista', 'cbautista@test.com', 'Juans-MacBook-Pro\juandejesus', 'IT', 'System Administrator', 'https://randomuser.me/api/portraits/men/81.jpg', 'A');

-- Add some employees without user accounts (to test the dropdown)
INSERT INTO [Employees] (EmployeeNumber, FirstName, LastName, FullName, Email, DomainUsername, Department, JobTitle, PhotoURL, EmployeeStatus)
VALUES ('E007', 'Maria', 'Garcia', 'Maria Garcia', 'mgarcia@test.com', 'MATRIX\mgarcia', 'HR', 'HR Manager', 'https://randomuser.me/api/portraits/women/44.jpg', 'A');

INSERT INTO [Employees] (EmployeeNumber, FirstName, LastName, FullName, Email, DomainUsername, Department, JobTitle, PhotoURL, EmployeeStatus)
VALUES ('E008', 'Ana', 'Rodriguez', 'Ana Rodriguez', 'arodriguez@test.com', 'MATRIX\arodriguez', 'Marketing', 'Marketing Specialist', 'https://randomuser.me/api/portraits/women/45.jpg', 'A');

GO

-- Now create user accounts linked to employees
DECLARE @AdminRoleId BIGINT, @UserRoleId BIGINT, @ViewerRoleId BIGINT, @ManagerRoleId BIGINT;
DECLARE @Emp1 BIGINT, @Emp2 BIGINT, @Emp3 BIGINT, @Emp4 BIGINT, @Emp5 BIGINT, @Emp6 BIGINT;

-- Get role IDs
SELECT @AdminRoleId = Id FROM [UserRoles] WHERE RoleName = 'Admin';
SELECT @UserRoleId = Id FROM [UserRoles] WHERE RoleName = 'User';
SELECT @ManagerRoleId = Id FROM [UserRoles] WHERE RoleName = 'Manager';
SELECT @ViewerRoleId = Id FROM [UserRoles] WHERE RoleName = 'Viewer';

-- Get employee IDs
SELECT @Emp1 = Id FROM [Employees] WHERE EmployeeNumber = 'E001';
SELECT @Emp2 = Id FROM [Employees] WHERE EmployeeNumber = 'E002';
SELECT @Emp3 = Id FROM [Employees] WHERE EmployeeNumber = 'E003';
SELECT @Emp4 = Id FROM [Employees] WHERE EmployeeNumber = 'E004';
SELECT @Emp5 = Id FROM [Employees] WHERE EmployeeNumber = 'E005';
SELECT @Emp6 = Id FROM [Employees] WHERE EmployeeNumber = 'E006';

-- Create user accounts (6 employees with access, 2 without)
INSERT INTO [User] (EmployeeId, RoleId, UserStatus)
VALUES (@Emp1, @AdminRoleId, 'A');

INSERT INTO [User] (EmployeeId, RoleId, UserStatus)
VALUES (@Emp2, @AdminRoleId, 'A');

INSERT INTO [User] (EmployeeId, RoleId, UserStatus)
VALUES (@Emp3, @UserRoleId, 'A');

INSERT INTO [User] (EmployeeId, RoleId, UserStatus)
VALUES (@Emp4, @ViewerRoleId, 'A');

INSERT INTO [User] (EmployeeId, RoleId, UserStatus)
VALUES (@Emp5, @ManagerRoleId, 'A');

INSERT INTO [User] (EmployeeId, RoleId, UserStatus)
VALUES (@Emp6, @AdminRoleId, 'A');

GO

-- ==============================================================
-- Table: UserSettings
-- ==============================================================
CREATE TABLE [dbo].[UserSettings] (
    Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    UserId BIGINT NOT NULL,
    Language NVARCHAR(10) DEFAULT 'en',
    DateFormat NVARCHAR(20) DEFAULT 'yyyy-mm-dd',
    SiderColor NVARCHAR(20) DEFAULT '#001529',
    Theme NVARCHAR(10) DEFAULT 'light',
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    UpdatedDate DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_UserSettings_User FOREIGN KEY (UserId) REFERENCES [User](Id) ON DELETE CASCADE,
    CONSTRAINT UQ_UserSettings_UserId UNIQUE (UserId)
);
GO

-- ==============================================================
-- EMPLOYEE STORED PROCEDURES
-- ==============================================================

-- --------------------------------------------------------------
-- Procedure: Employees_GetList
-- --------------------------------------------------------------
CREATE PROCEDURE [dbo].[Employees_GetList]
    @IncludeTerminated BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        e.Id, e.EmployeeNumber, e.FirstName, e.LastName, e.FullName,
        e.Email, e.DomainUsername, e.Department, e.JobTitle,
        e.PhoneNumber, e.PhotoURL, e.ManagerId, e.HireDate,
        e.TerminationDate, e.EmployeeStatus, e.CreatedDate, e.UpdatedDate,
        m.FullName AS ManagerName
    FROM [Employees] e
    LEFT JOIN [Employees] m ON e.ManagerId = m.Id
    WHERE (@IncludeTerminated = 1 OR e.EmployeeStatus != 'T')
    ORDER BY e.FullName;
END
GO

-- --------------------------------------------------------------
-- Procedure: Employees_GetWithoutUserAccess
-- --------------------------------------------------------------
CREATE PROCEDURE [dbo].[Employees_GetWithoutUserAccess]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        e.Id, e.EmployeeNumber, e.FirstName, e.LastName, e.FullName,
        e.Email, e.DomainUsername, e.Department, e.JobTitle, e.PhotoURL
    FROM [Employees] e
    LEFT JOIN [User] u ON e.Id = u.EmployeeId
    WHERE u.Id IS NULL  -- No user account exists
      AND e.EmployeeStatus = 'A'  -- Only active employees
    ORDER BY e.FullName;
END
GO

-- --------------------------------------------------------------
-- Procedure: Employees_Get
-- --------------------------------------------------------------
CREATE PROCEDURE [dbo].[Employees_Get]
    @Id BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        e.Id, e.EmployeeNumber, e.FirstName, e.LastName, e.FullName,
        e.Email, e.DomainUsername, e.Department, e.JobTitle,
        e.PhoneNumber, e.PhotoURL, e.ManagerId, e.HireDate,
        e.TerminationDate, e.EmployeeStatus, e.CreatedDate, e.UpdatedDate,
        m.FullName AS ManagerName
    FROM [Employees] e
    LEFT JOIN [Employees] m ON e.ManagerId = m.Id
    WHERE e.Id = @Id;
END
GO

-- --------------------------------------------------------------
-- Procedure: Employees_Add
-- --------------------------------------------------------------
CREATE PROCEDURE [dbo].[Employees_Add]
    @EmployeeNumber NVARCHAR(50),
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Email NVARCHAR(100),
    @DomainUsername NVARCHAR(100) = NULL,
    @Department NVARCHAR(100) = NULL,
    @JobTitle NVARCHAR(100) = NULL,
    @PhoneNumber NVARCHAR(50) = NULL,
    @PhotoURL NVARCHAR(500) = NULL,
    @ManagerId BIGINT = NULL,
    @HireDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @FullName NVARCHAR(200) = @FirstName + ' ' + @LastName;

    INSERT INTO [Employees] (
        EmployeeNumber, FirstName, LastName, FullName, Email,
        DomainUsername, Department, JobTitle, PhoneNumber,
        PhotoURL, ManagerId, HireDate, EmployeeStatus
    )
    VALUES (
        @EmployeeNumber, @FirstName, @LastName, @FullName, @Email,
        @DomainUsername, @Department, @JobTitle, @PhoneNumber,
        @PhotoURL, @ManagerId, @HireDate, 'A'
    );

    SELECT SCOPE_IDENTITY() AS Id;
END
GO

-- --------------------------------------------------------------
-- Procedure: Employees_Update
-- --------------------------------------------------------------
CREATE PROCEDURE [dbo].[Employees_Update]
    @Id BIGINT,
    @EmployeeNumber NVARCHAR(50),
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Email NVARCHAR(100),
    @DomainUsername NVARCHAR(100) = NULL,
    @Department NVARCHAR(100) = NULL,
    @JobTitle NVARCHAR(100) = NULL,
    @PhoneNumber NVARCHAR(50) = NULL,
    @PhotoURL NVARCHAR(500) = NULL,
    @ManagerId BIGINT = NULL,
    @HireDate DATE = NULL,
    @TerminationDate DATE = NULL,
    @EmployeeStatus NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @FullName NVARCHAR(200) = @FirstName + ' ' + @LastName;

    UPDATE [Employees]
    SET EmployeeNumber = @EmployeeNumber,
        FirstName = @FirstName,
        LastName = @LastName,
        FullName = @FullName,
        Email = @Email,
        DomainUsername = @DomainUsername,
        Department = @Department,
        JobTitle = @JobTitle,
        PhoneNumber = @PhoneNumber,
        PhotoURL = @PhotoURL,
        ManagerId = @ManagerId,
        HireDate = @HireDate,
        TerminationDate = @TerminationDate,
        EmployeeStatus = @EmployeeStatus,
        UpdatedDate = GETDATE()
    WHERE Id = @Id;
END
GO

-- ==============================================================
-- USER STORED PROCEDURES
-- ==============================================================

-- --------------------------------------------------------------
-- Procedure: User_GetList
-- --------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_GetList]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_GetList];
GO

CREATE PROCEDURE [dbo].[User_GetList]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        u.Id, u.EmployeeId, u.RoleId, u.UserStatus,
        u.LastActiveTime, u.LastLoginTime, u.AccountCreatedDate,
        -- Employee details
        e.EmployeeNumber, e.FirstName, e.LastName, e.FullName AS Name,
        e.Email, e.DomainUsername AS Username, e.PhotoURL,
        e.Department, e.JobTitle,
        -- Role details
        r.RoleName AS Role
    FROM [User] u
    INNER JOIN [Employees] e ON u.EmployeeId = e.Id
    LEFT JOIN [UserRoles] r ON u.RoleId = r.Id
    ORDER BY e.FullName ASC;
END
GO

-- --------------------------------------------------------------
-- Procedure: User_Get
-- --------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Get]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_Get];
GO

CREATE PROCEDURE [dbo].[User_Get]
    @Id BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        u.Id, u.EmployeeId, u.RoleId, u.UserStatus,
        u.LastActiveTime, u.LastLoginTime, u.AccountCreatedDate,
        -- Employee details
        e.EmployeeNumber, e.FirstName, e.LastName, e.FullName AS Name,
        e.Email, e.DomainUsername AS Username, e.PhotoURL,
        e.Department, e.JobTitle,
        -- Role details
        r.RoleName AS Role
    FROM [User] u
    INNER JOIN [Employees] e ON u.EmployeeId = e.Id
    LEFT JOIN [UserRoles] r ON u.RoleId = r.Id
    WHERE u.Id = @Id;
END
GO

-- --------------------------------------------------------------
-- Procedure: User_GetByUsernameOrEmail
-- --------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_GetByUsernameOrEmail]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_GetByUsernameOrEmail];
GO

CREATE PROCEDURE [dbo].[User_GetByUsernameOrEmail]
    @UsernameOrEmail NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        u.Id, u.EmployeeId, u.UserStatus,
        e.FullName AS Name, e.DomainUsername AS Username, e.Email, e.PhotoURL
    FROM [User] u
    INNER JOIN [Employees] e ON u.EmployeeId = e.Id
    WHERE e.DomainUsername = @UsernameOrEmail OR e.Email = @UsernameOrEmail;
END
GO

-- --------------------------------------------------------------
-- Procedure: User_GetByDomainUsername
-- --------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_GetByDomainUsername]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_GetByDomainUsername];
GO

CREATE PROCEDURE [dbo].[User_GetByDomainUsername]
    @DomainUsername NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        u.Id, u.EmployeeId, u.RoleId, u.UserStatus,
        u.LastActiveTime, u.LastLoginTime,
        -- Employee details
        e.EmployeeNumber, e.FullName AS Name, e.Email,
        e.DomainUsername AS Username, e.PhotoURL,
        e.Department, e.JobTitle,
        -- Role details
        r.RoleName AS Role
    FROM [User] u
    INNER JOIN [Employees] e ON u.EmployeeId = e.Id
    LEFT JOIN [UserRoles] r ON u.RoleId = r.Id
    WHERE e.DomainUsername = @DomainUsername;
END
GO

-- --------------------------------------------------------------
-- Procedure: User_Add
-- --------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Add]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_Add];
GO

CREATE PROCEDURE [dbo].[User_Add]
    @EmployeeId BIGINT,
    @RoleId BIGINT = NULL,
    @CreatedBy BIGINT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Validate employee exists and is active
    IF NOT EXISTS (SELECT 1 FROM [Employees] WHERE Id = @EmployeeId AND EmployeeStatus = 'A')
    BEGIN
        RAISERROR('Employee not found or inactive', 16, 1);
        RETURN;
    END

    -- Check if user account already exists for this employee
    IF EXISTS (SELECT 1 FROM [User] WHERE EmployeeId = @EmployeeId)
    BEGIN
        RAISERROR('User account already exists for this employee', 16, 1);
        RETURN;
    END

    -- If RoleId is not provided, default to 'User' role
    IF @RoleId IS NULL
    BEGIN
        SELECT @RoleId = Id FROM [UserRoles] WHERE RoleName = 'User';
    END

    INSERT INTO [User] (EmployeeId, RoleId, UserStatus, AccountCreatedBy)
    VALUES (@EmployeeId, @RoleId, 'A', @CreatedBy);

    SELECT SCOPE_IDENTITY() AS Id;
END
GO

-- --------------------------------------------------------------
-- Procedure: User_Delete
-- --------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Delete]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_Delete];
GO

CREATE PROCEDURE [dbo].[User_Delete]
    @Id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM [User] WHERE Id = @Id;
END
GO

-- --------------------------------------------------------------
-- Procedure: User_Inactivate
-- --------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Inactivate]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_Inactivate];
GO

CREATE PROCEDURE [dbo].[User_Inactivate]
    @Id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE [User]
    SET UserStatus = 'I'
    WHERE Id = @Id;
END
GO

-- --------------------------------------------------------------
-- Procedure: User_Update
-- --------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Update]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_Update];
GO

CREATE PROCEDURE [dbo].[User_Update]
    @Id BIGINT,
    @RoleId BIGINT = NULL,
    @UserStatus NVARCHAR(10),
    @ModifiedBy BIGINT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [User]
    SET RoleId = ISNULL(@RoleId, RoleId),
        UserStatus = @UserStatus,
        AccountModifiedDate = GETDATE(),
        AccountModifiedBy = @ModifiedBy
    WHERE Id = @Id;
END
GO

-- --------------------------------------------------------------
-- Procedure: User_Activate
-- --------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Activate]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_Activate];
GO

CREATE PROCEDURE [dbo].[User_Activate]
    @Id BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [User]
    SET UserStatus = 'A'
    WHERE Id = @Id;
END
GO

-- ==============================================================
-- UserRoles Stored Procedures
-- ==============================================================

-- --------------------------------------------------------------
-- Procedure: UserRoles_GetList
-- --------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserRoles_GetList]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[UserRoles_GetList];
GO

CREATE PROCEDURE [dbo].[UserRoles_GetList]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        r.Id, r.RoleName, r.Description, r.CreatedDate
    FROM [UserRoles] r
    ORDER BY r.RoleName;
END
GO

-- ==============================================================
-- UserSettings Stored Procedures
-- ==============================================================

-- --------------------------------------------------------------
-- Procedure: UserSettings_Get
-- --------------------------------------------------------------
CREATE PROCEDURE [dbo].[UserSettings_Get]
    @UserId BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        us.Id, us.UserId, us.Language, us.DateFormat, us.SiderColor, us.Theme, us.CreatedDate, us.UpdatedDate
    FROM [UserSettings] us
    WHERE us.UserId = @UserId;
END
GO

-- --------------------------------------------------------------
-- Procedure: UserSettings_Upsert
-- --------------------------------------------------------------
CREATE PROCEDURE [dbo].[UserSettings_Upsert]
    @UserId BIGINT,
    @Language NVARCHAR(10),
    @DateFormat NVARCHAR(20),
    @SiderColor NVARCHAR(20),
    @Theme NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    -- Use MERGE for upsert functionality
    MERGE INTO [UserSettings] AS target
    USING (SELECT @UserId AS UserId) AS source
    ON target.UserId = source.UserId
    WHEN MATCHED THEN
        UPDATE SET
            Language = @Language,
            DateFormat = @DateFormat,
            SiderColor = @SiderColor,
            Theme = @Theme,
            UpdatedDate = GETDATE()
    WHEN NOT MATCHED THEN
        INSERT (UserId, Language, DateFormat, SiderColor, Theme)
        VALUES (@UserId, @Language, @DateFormat, @SiderColor, @Theme);

    -- Return the updated/inserted settings
    SELECT
        us.Id, us.UserId, us.Language, us.DateFormat, us.SiderColor, us.Theme, us.CreatedDate, us.UpdatedDate
    FROM [UserSettings] us
    WHERE us.UserId = @UserId;
END
GO