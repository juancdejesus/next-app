-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS datahub;

-- Create the user if it doesn't exist
CREATE USER IF NOT EXISTS 'hub'@'%' IDENTIFIED BY 'hub';

-- Grant all privileges on datahub to user hub
GRANT ALL PRIVILEGES ON datahub.* TO 'hub'@'%';

-- Apply the changes
FLUSH PRIVILEGES;

-- Switch to datahub database
USE datahub;

-- ==============================================================
-- Table: user
-- ==============================================================
CREATE TABLE IF NOT EXISTS user (
    id BIGINT auto_increment NOT NULL PRIMARY KEY,
    name VARCHAR(200) NULL, 
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_status VARCHAR(10) NULL,
    open_date DATE NULL,
    close_date DATE NULL    
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

TRUNCATE TABLE user;

-- Insert initial users (only if they don't exist)
INSERT IGNORE INTO user (name, username, email, password_hash, user_status, open_date, close_date) VALUES 
('Admin', 'admin', 'admin@example.com', '$2a$04$yydSfPlMRY1y5y6oMGcpIOyCFBs4TmjnoW7zrC4f2RcPpE2PJeEZS', 'A', '2025-01-01', null),
('Juan De Jesus', 'juan', 'juancdejesus@hotmail.com', '$2a$12$gG2WW0mHAHCVg1mKShZyVO78olNfaVKwrYMN.nydyA1xZmBNXgAvC', 'A', '2025-01-01', null),
('Monitor User', 'monitor', 'monitor@example.com', '$2a$12$gG2WW0mHAHCVg1mKShZyVO78olNfaVKwrYMN.nydyA1xZmBNXgAvC', 'A', '2025-01-01', null),
('Pedro Martinez', 'pedro', 'pedro@example.com', '$2a$12$gG2WW0mHAHCVg1mKShZyVO78olNfaVKwrYMN.nydyA1xZmBNXgAvC', 'A', '2025-07-01', null);

-- --------------------------------------------------------------
-- Procedure: proc_get_user_list
-- --------------------------------------------------------------
DROP PROCEDURE IF EXISTS proc_get_user_list;

CREATE PROCEDURE proc_get_user_list()
BEGIN
    SELECT 
        u.id, u.name, u.username, u.email, u.user_status, u.open_date, u.close_date 
    FROM user u;
END;

-- --------------------------------------------------------------
-- Procedure: proc_get_user
-- --------------------------------------------------------------
DROP PROCEDURE IF EXISTS proc_get_user;

CREATE PROCEDURE proc_get_user(IN p_id BIGINT)
BEGIN
    SELECT 
        u.id, u.name, u.username, u.email, u.user_status, u.open_date, u.close_date 
    FROM user u
    WHERE u.id = p_id;
END;

-- --------------------------------------------------------------
-- Procedure: proc_get_user_by_username_or_email
-- --------------------------------------------------------------
DROP PROCEDURE IF EXISTS proc_get_user_by_username_or_email;

CREATE PROCEDURE proc_get_user_by_username_or_email(IN p_username_or_email VARCHAR(100))
BEGIN
    SELECT 
        u.id, u.name, u.username, u.email, u.password_hash, u.user_status, u.open_date, u.close_date 
    FROM user u
    WHERE u.username = p_username_or_email OR u.email = p_username_or_email;
END;

-- --------------------------------------------------------------
-- Procedure: proc_add_user
-- --------------------------------------------------------------
DROP PROCEDURE IF EXISTS proc_add_user;

CREATE PROCEDURE proc_add_user(
    IN p_name VARCHAR(200), IN p_username VARCHAR(50), IN p_email VARCHAR(100), IN p_password_hash VARCHAR(255)
)
BEGIN
    INSERT INTO user (name, username, email, password_hash, user_status, open_date) 
    VALUES (p_name, p_username, p_email, p_password_hash, 'A', CURDATE());
    SELECT LAST_INSERT_ID() as id;
END; 

-- --------------------------------------------------------------
-- Procedure: proc_delete_user
-- --------------------------------------------------------------
DROP PROCEDURE IF EXISTS proc_delete_user;

CREATE PROCEDURE proc_delete_user(IN p_id BIGINT)
BEGIN
    DELETE FROM user WHERE id = p_id;
END;

-- --------------------------------------------------------------
-- Procedure: proc_inactivate_user
-- --------------------------------------------------------------
DROP PROCEDURE IF EXISTS proc_inactivate_user;

CREATE PROCEDURE proc_inactivate_user(IN p_id BIGINT)
BEGIN
    UPDATE user SET user_status = 'I', close_date = CURDATE() WHERE id = p_id;
END;


-- --------------------------------------------------------------
-- Procedure: proc_update_user
-- --------------------------------------------------------------
DROP PROCEDURE IF EXISTS proc_update_user;

CREATE PROCEDURE proc_update_user(
    IN p_id BIGINT, IN p_name VARCHAR(200), IN p_username VARCHAR(50), IN p_email VARCHAR(100), IN p_user_status VARCHAR(10)
)
BEGIN
    UPDATE user SET name = p_name, username = p_username, email = p_email, user_status = p_user_status
    WHERE id = p_id;
END;

-- ==============================================================
-- Table: user_settings
-- ==============================================================
CREATE TABLE IF NOT EXISTS user_settings (
    id BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    date_format VARCHAR(20) DEFAULT 'yyyy-mm-dd',
    sider_color VARCHAR(20) DEFAULT '#001529',
    theme VARCHAR(10) DEFAULT 'light',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_settings (user_id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------------
-- Procedure: proc_get_user_settings
-- --------------------------------------------------------------
DROP PROCEDURE IF EXISTS proc_get_user_settings;

CREATE PROCEDURE proc_get_user_settings(IN p_user_id BIGINT)
BEGIN
    SELECT
        us.id, us.user_id, us.language, us.date_format, us.sider_color, us.theme, us.created_at, us.updated_at
    FROM user_settings us
    WHERE us.user_id = p_user_id;
END;

-- --------------------------------------------------------------
-- Procedure: proc_upsert_user_settings
-- --------------------------------------------------------------
DROP PROCEDURE IF EXISTS proc_upsert_user_settings;

CREATE PROCEDURE proc_upsert_user_settings(
    IN p_user_id BIGINT,
    IN p_language VARCHAR(10),
    IN p_date_format VARCHAR(20),
    IN p_sider_color VARCHAR(20),
    IN p_theme VARCHAR(10)
)
BEGIN
    INSERT INTO user_settings (user_id, language, date_format, sider_color, theme)
    VALUES (p_user_id, p_language, p_date_format, p_sider_color, p_theme)
    ON DUPLICATE KEY UPDATE
        language = p_language,
        date_format = p_date_format,
        sider_color = p_sider_color,
        theme = p_theme,
        updated_at = CURRENT_TIMESTAMP;

    -- Return the updated/inserted settings
    SELECT
        us.id, us.user_id, us.language, us.date_format, us.sider_color, us.theme, us.created_at, us.updated_at
    FROM user_settings us
    WHERE us.user_id = p_user_id;
END;