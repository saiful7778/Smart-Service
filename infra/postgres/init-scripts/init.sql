-- ---------- 1. Create roles ----------
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'db_migrator') THEN
        CREATE ROLE db_migrator LOGIN PASSWORD '12345678';
    ELSE
        -- If role already exists, ensure it has CREATEDB privilege
        ALTER ROLE db_migrator CREATEDB;
    END IF;

    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'db_rw') THEN
        CREATE ROLE db_rw LOGIN PASSWORD '12345678';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'db_ro') THEN
        CREATE ROLE db_ro LOGIN PASSWORD '12345678';
    END IF;
END
$$;

-- ---------- 2. Create databases ----------
CREATE DATABASE test;
CREATE DATABASE shadow_db;

-- ============================================================
-- Apply permissions for each database
-- ============================================================

------------------------------------------------------------
-- Setup for smart_service
------------------------------------------------------------
\connect smart_service

-- Remove unsafe default privileges
REVOKE ALL ON DATABASE smart_service FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- Prisma requires the db_migrator to own the schema
ALTER SCHEMA public OWNER TO db_migrator;

-- db_Migrator full control
GRANT USAGE, CREATE ON SCHEMA public TO db_migrator;
GRANT ALL PRIVILEGES ON DATABASE smart_service TO db_migrator;

-- Read/Write application user
GRANT USAGE ON SCHEMA public TO db_rw;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO db_rw;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO db_rw;

-- Readonly user
GRANT USAGE ON SCHEMA public TO db_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO db_ro;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO db_ro;

-- Default privileges for FUTURE objects created by db_migrator
ALTER DEFAULT PRIVILEGES FOR ROLE db_migrator IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO db_rw;

ALTER DEFAULT PRIVILEGES FOR ROLE db_migrator IN SCHEMA public
    GRANT SELECT ON TABLES TO db_ro;

ALTER DEFAULT PRIVILEGES FOR ROLE db_migrator IN SCHEMA public
    GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO db_rw;

ALTER DEFAULT PRIVILEGES FOR ROLE db_migrator IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO db_ro;

-- Allow connections
GRANT CONNECT ON DATABASE smart_service TO db_migrator, db_rw, db_ro;

------------------------------------------------------------
-- Setup for test database
------------------------------------------------------------
\connect test

REVOKE ALL ON DATABASE test FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

ALTER SCHEMA public OWNER TO db_migrator;
GRANT USAGE, CREATE ON SCHEMA public TO db_migrator;
GRANT ALL PRIVILEGES ON DATABASE test TO db_migrator;

GRANT USAGE ON SCHEMA public TO db_rw, db_ro;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO db_rw;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO db_rw;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO db_ro;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO db_ro;

ALTER DEFAULT PRIVILEGES FOR ROLE db_migrator IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO db_rw;

ALTER DEFAULT PRIVILEGES FOR ROLE db_migrator IN SCHEMA public
    GRANT SELECT ON TABLES TO db_ro;

ALTER DEFAULT PRIVILEGES FOR ROLE db_migrator IN SCHEMA public
    GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO db_rw;

ALTER DEFAULT PRIVILEGES FOR ROLE db_migrator IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO db_ro;

GRANT CONNECT ON DATABASE test TO db_migrator, db_rw, db_ro;

------------------------------------------------------------
-- Setup for shadow_db database (optional)
------------------------------------------------------------
\connect shadow_db

REVOKE ALL ON DATABASE shadow_db FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

ALTER SCHEMA public OWNER TO db_migrator;
GRANT ALL PRIVILEGES ON DATABASE shadow_db TO db_migrator;
GRANT USAGE, CREATE ON SCHEMA public TO db_migrator;

-- Allow connections to shadow database
GRANT CONNECT ON DATABASE shadow_db TO db_migrator;

------------------------------------------------------------
-- Final setup: Ensure db_migrator can connect to all databases
------------------------------------------------------------
\connect postgres

-- Grant connection privileges globally
GRANT CONNECT ON DATABASE smart_service TO db_migrator;
GRANT CONNECT ON DATABASE test TO db_migrator;
GRANT CONNECT ON DATABASE shadow_db TO db_migrator;

-- Output confirmation
SELECT 'Database initialization complete' AS message;
SELECT 
    datname as database, 
    array_agg(rolname) as allowed_users
FROM pg_database d
CROSS JOIN pg_roles r
WHERE d.datname IN ('smart_service', 'test', 'shadow_db')
AND r.rolname IN ('db_migrator', 'db_rw', 'db_ro')
AND has_database_privilege(r.rolname, d.datname, 'CONNECT')
GROUP BY d.datname
ORDER BY d.datname;