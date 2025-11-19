-- Create the database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'DataHub')
BEGIN
    CREATE DATABASE DataHub;
END
GO

USE DataHub;
GO

-- ==============================================================
-- Table: User
-- ==============================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[User] (
        Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Name NVARCHAR(200) NULL,
        Username NVARCHAR(50) NOT NULL UNIQUE,
        Email NVARCHAR(100) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        UserStatus NVARCHAR(10) NULL,
        OpenDate DATE NULL,
        CloseDate DATE NULL,
        LastActiveTime DATETIME2 NULL DEFAULT GETDATE()
    );
END
GO

-- Add LastActiveTime column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[User]') AND name = 'LastActiveTime')
BEGIN
    ALTER TABLE [dbo].[User] ADD LastActiveTime DATETIME2 NULL DEFAULT GETDATE();
END
GO

-- ==============================================================
-- Table: UserRoles
-- ==============================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserRoles]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[UserRoles] (
        Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        RoleName NVARCHAR(50) NOT NULL UNIQUE,
        Description NVARCHAR(200) NULL,
        CreatedDate DATETIME2 NULL DEFAULT GETDATE()
    );
END
GO

-- Insert default roles
IF NOT EXISTS (SELECT 1 FROM [UserRoles] WHERE RoleName = 'Admin')
    INSERT INTO [UserRoles] (RoleName, Description) VALUES ('Admin', 'System Administrator with full access');

IF NOT EXISTS (SELECT 1 FROM [UserRoles] WHERE RoleName = 'Manager')
    INSERT INTO [UserRoles] (RoleName, Description) VALUES ('Manager', 'Manager with elevated permissions');

IF NOT EXISTS (SELECT 1 FROM [UserRoles] WHERE RoleName = 'User')
    INSERT INTO [UserRoles] (RoleName, Description) VALUES ('User', 'Standard user with basic permissions');

IF NOT EXISTS (SELECT 1 FROM [UserRoles] WHERE RoleName = 'Viewer')
    INSERT INTO [UserRoles] (RoleName, Description) VALUES ('Viewer', 'Read-only access user');
GO

-- Add RoleId column to User table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[User]') AND name = 'RoleId')
BEGIN
    ALTER TABLE [dbo].[User] ADD RoleId BIGINT NULL;

    -- Add foreign key constraint
    ALTER TABLE [dbo].[User]
    ADD CONSTRAINT FK_User_UserRoles FOREIGN KEY (RoleId) REFERENCES [UserRoles](Id);

    -- Set default role to 'User' for existing records
    DECLARE @DefaultRoleId BIGINT;
    SELECT @DefaultRoleId = Id FROM [UserRoles] WHERE RoleName = 'User';
    UPDATE [User] SET RoleId = @DefaultRoleId WHERE RoleId IS NULL;
END
GO

-- Clear existing data
TRUNCATE TABLE [User];
GO

-- Insert initial users
IF NOT EXISTS (SELECT 1 FROM [User] WHERE Username = 'admin')
    INSERT INTO [User] (Name, Username, Email, PasswordHash, UserStatus, OpenDate, CloseDate) 
    VALUES ('Admin', 'admin', 'admin@example.com', '$2a$04$yydSfPlMRY1y5y6oMGcpIOyCFBs4TmjnoW7zrC4f2RcPpE2PJeEZS', 'A', '2025-01-01', NULL);

IF NOT EXISTS (SELECT 1 FROM [User] WHERE Username = 'juan')
    INSERT INTO [User] (Name, Username, Email, PasswordHash, UserStatus, OpenDate, CloseDate) 
    VALUES ('Juan De Jesus', 'juan', 'juancdejesus@hotmail.com', '$2a$12$gG2WW0mHAHCVg1mKShZyVO78olNfaVKwrYMN.nydyA1xZmBNXgAvC', 'A', '2025-01-01', NULL);

IF NOT EXISTS (SELECT 1 FROM [User] WHERE Username = 'monitor')
    INSERT INTO [User] (Name, Username, Email, PasswordHash, UserStatus, OpenDate, CloseDate) 
    VALUES ('Monitor User', 'monitor', 'monitor@example.com', '$2a$12$gG2WW0mHAHCVg1mKShZyVO78olNfaVKwrYMN.nydyA1xZmBNXgAvC', 'A', '2025-01-01', NULL);

IF NOT EXISTS (SELECT 1 FROM [User] WHERE Username = 'pedro')
    INSERT INTO [User] (Name, Username, Email, PasswordHash, UserStatus, OpenDate, CloseDate) 
    VALUES ('Pedro Martinez', 'pedro', 'pedro@example.com', '$2a$12$gG2WW0mHAHCVg1mKShZyVO78olNfaVKwrYMN.nydyA1xZmBNXgAvC', 'A', '2025-07-01', NULL);
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
        u.Id, u.Name, u.Username, u.Email, u.UserStatus, u.OpenDate, u.CloseDate, u.LastActiveTime,
        u.RoleId, r.RoleName AS Role
    FROM [User] u
    LEFT JOIN [UserRoles] r ON u.RoleId = r.Id;
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
        u.Id, u.Name, u.Username, u.Email, u.UserStatus, u.OpenDate, u.CloseDate, u.LastActiveTime,
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
        u.Id, u.Name, u.Username, u.Email, u.PasswordHash, u.UserStatus, u.OpenDate, u.CloseDate 
    FROM [User] u
    WHERE u.Username = @UsernameOrEmail OR u.Email = @UsernameOrEmail;
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
    @PasswordHash NVARCHAR(255),
    @RoleId BIGINT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- If RoleId is not provided, default to 'User' role
    IF @RoleId IS NULL
    BEGIN
        SELECT @RoleId = Id FROM [UserRoles] WHERE RoleName = 'User';
    END

    INSERT INTO [User] (Name, Username, Email, PasswordHash, UserStatus, OpenDate, RoleId)
    VALUES (@Name, @Username, @Email, @PasswordHash, 'A', CAST(GETDATE() AS DATE), @RoleId);

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
    SET UserStatus = 'I', CloseDate = CAST(GETDATE() AS DATE) 
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
    @UserStatus NVARCHAR(10),
    @RoleId BIGINT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [User]
    SET Name = @Name,
        Username = @Username,
        Email = @Email,
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
    SET UserStatus = 'A', CloseDate = NULL
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
-- Table: UserSettings
-- ==============================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserSettings]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[UserSettings] (
        Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        UserId BIGINT NOT NULL,
        Language NVARCHAR(10) DEFAULT 'en',
        DateFormat NVARCHAR(20) DEFAULT 'yyyy-mm-dd',
        SiderColor NVARCHAR(20) DEFAULT '#001529',
        Theme NVARCHAR(10) DEFAULT 'light',
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_UserSettings_User FOREIGN KEY (UserId) REFERENCES [User](Id) ON DELETE CASCADE,
        CONSTRAINT UQ_UserSettings_UserId UNIQUE (UserId)
    );
END
GO

-- --------------------------------------------------------------
-- Procedure: UserSettings_Get
-- --------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserSettings_Get]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[UserSettings_Get];
GO

CREATE PROCEDURE [dbo].[UserSettings_Get]
    @UserId BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT
        us.Id, us.UserId, us.Language, us.DateFormat, us.SiderColor, us.Theme, us.CreatedAt, us.UpdatedAt
    FROM [UserSettings] us
    WHERE us.UserId = @UserId;
END
GO

-- --------------------------------------------------------------
-- Procedure: UserSettings_Upsert
-- --------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserSettings_Upsert]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[UserSettings_Upsert];
GO

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
            UpdatedAt = GETDATE()
    WHEN NOT MATCHED THEN
        INSERT (UserId, Language, DateFormat, SiderColor, Theme)
        VALUES (@UserId, @Language, @DateFormat, @SiderColor, @Theme);
    
    -- Return the updated/inserted settings
    SELECT
        us.Id, us.UserId, us.Language, us.DateFormat, us.SiderColor, us.Theme, us.CreatedAt, us.UpdatedAt
    FROM [UserSettings] us
    WHERE us.UserId = @UserId;
END
GO