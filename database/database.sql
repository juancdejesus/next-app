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
-- Table: User
-- ==============================================================
CREATE TABLE [dbo].[User] (
    Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Name NVARCHAR(200) NULL,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PhotoURL NVARCHAR(500) NULL,
    UserStatus NVARCHAR(10) NULL,
    LastActiveTime DATETIME2 NULL DEFAULT GETDATE(),
    RoleId BIGINT NULL,
    CONSTRAINT FK_User_UserRoles FOREIGN KEY (RoleId) REFERENCES [UserRoles](Id)
);
GO

-- Insert initial users
DECLARE @AdminRoleId BIGINT, @UserRoleId BIGINT, @ViewerRoleId INT, @ManagerRoleId INT;

SELECT @AdminRoleId = Id FROM [UserRoles] WHERE RoleName = 'Admin';
SELECT @UserRoleId = Id FROM [UserRoles] WHERE RoleName = 'User';
SELECT @ManagerRoleId = Id FROM [UserRoles] WHERE RoleName = 'Manager';
SELECT @ViewerRoleId = Id FROM [UserRoles] WHERE RoleName = 'Viewer';


INSERT INTO [User] (Name, Username, Email, PhotoURL, UserStatus, RoleId)
VALUES ('Juan De Jesus', 'MATRIX\juanc', 'juanc@test.com', 'https://randomuser.me/api/portraits/men/80.jpg', 'A', @AdminRoleId);


INSERT INTO [User] (Name, Username, Email, PhotoURL, UserStatus, RoleId)
VALUES ('Jose Perez', 'MATRIX\jperez', 'jperez@test.com', 'https://randomuser.me/api/portraits/men/81.jpg', 'A', @AdminRoleId);

INSERT INTO [User] (Name, Username, Email, PhotoURL, UserStatus, RoleId)
VALUES ('Jose Ramirez', 'MATRIX\jramirez', 'jramirez@test.com', 'https://randomuser.me/api/portraits/men/74.jpg', 'A', @UserRoleId);

INSERT INTO [User] (Name, Username, Email, PhotoURL, UserStatus, RoleId)
VALUES ('Josue Castellanos', 'MATRIX\jcastellanos', 'jcastellanos@example.com', 'https://randomuser.me/api/portraits/men/75.jpg', 'A', @ViewerRoleId);

INSERT INTO [User] (Name, Username, Email, PhotoURL, UserStatus, RoleId)
VALUES ('Pedro Martinez', 'MATRIX\pmartinez', 'pedro@example.com', 'https://randomuser.me/api/portraits/men/79.jpg', 'A', @ManagerRoleId);
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
        u.Id, u.Name, u.Username, u.Email, u.PhotoURL, u.UserStatus, u.LastActiveTime,
        u.RoleId, r.RoleName AS Role
    FROM [User] u
    LEFT JOIN [UserRoles] r ON u.RoleId = r.Id
    ORDER BY u.Name ASC;
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
        u.Id, u.Name, u.Username, u.Email, u.PhotoURL, u.UserStatus, u.LastActiveTime,
        u.RoleId, r.RoleName AS Role
    FROM [User] u
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
        u.Id, u.Name, u.Username, u.Email, u.PhotoURL, u.UserStatus
    FROM [User] u
    WHERE u.Username = @UsernameOrEmail OR u.Email = @UsernameOrEmail;
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
        u.Id, u.Name, u.Username, u.Email, u.PhotoURL, u.UserStatus, u.LastActiveTime,
        u.RoleId, r.RoleName AS Role
    FROM [User] u
    LEFT JOIN [UserRoles] r ON u.RoleId = r.Id
    WHERE u.Username = @DomainUsername;
END
GO

-- --------------------------------------------------------------
-- Procedure: User_Add
-- --------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User_Add]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[User_Add];
GO

CREATE PROCEDURE [dbo].[User_Add]
    @Name NVARCHAR(200),
    @Username NVARCHAR(50),
    @Email NVARCHAR(100),
    @PhotoURL NVARCHAR(500) = NULL,
    @RoleId BIGINT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- If RoleId is not provided, default to 'User' role
    IF @RoleId IS NULL
    BEGIN
        SELECT @RoleId = Id FROM [UserRoles] WHERE RoleName = 'User';
    END

    INSERT INTO [User] (Name, Username, Email, PhotoURL, UserStatus, RoleId)
    VALUES (@Name, @Username, @Email, @PhotoURL, 'A', @RoleId);

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
    @Name NVARCHAR(200),
    @Username NVARCHAR(50),
    @Email NVARCHAR(100),
    @PhotoURL NVARCHAR(500) = NULL,
    @UserStatus NVARCHAR(10),
    @RoleId BIGINT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [User]
    SET Name = @Name,
        Username = @Username,
        Email = @Email,
        PhotoURL = @PhotoURL,
        UserStatus = @UserStatus,
        RoleId = ISNULL(@RoleId, RoleId)  -- Only update if provided
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