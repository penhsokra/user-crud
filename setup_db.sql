-- Database Setup Script for User CRUD Application

-- 1. Create User (if not exists)
-- Run this as superuser (postgres)
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'appuser') THEN
      CREATE USER appuser WITH PASSWORD 'appuser';
   END IF;
END $$;

-- 2. Create Database
-- Note: Run 'CREATE DATABASE appdb;' manually if it doesn't exist yet.

-- 3. Grant Permissions
GRANT ALL PRIVILEGES ON DATABASE appdb TO appuser;

-- 4. Switch to appdb and create the schema
-- In psql use: \c appdb
-- In pgAdmin, run this in the Query Tool while connected to appdb

CREATE SCHEMA IF NOT EXISTS appdb AUTHORIZATION appuser;

-- Set search path to appdb so tables are created there
SET search_path TO appdb;

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

-- Grant table-level permissions
ALTER TABLE users OWNER TO appuser;
GRANT USAGE ON SCHEMA appdb TO appuser;
GRANT ALL PRIVILEGES ON TABLE users TO appuser;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE users_id_seq TO appuser;


