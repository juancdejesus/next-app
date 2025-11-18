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
        CloseDate DATE NULL    
    );
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
        u.Id, u.Name, u.Username, u.Email, u.UserStatus, u.OpenDate, u.CloseDate 
    FROM [User] u;
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
        u.Id, u.Name, u.Username, u.Email, u.UserStatus, u.OpenDate, u.CloseDate 
    FROM [User] u
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
    @PasswordHash NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO [User] (Name, Username, Email, PasswordHash, UserStatus, OpenDate) 
    VALUES (@Name, @Username, @Email, @PasswordHash, 'A', CAST(GETDATE() AS DATE));
    
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
    @UserStatus NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE [User] 
    SET Name = @Name, 
        Username = @Username, 
        Email = @Email, 
        UserStatus = @UserStatus
    WHERE Id = @Id;
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