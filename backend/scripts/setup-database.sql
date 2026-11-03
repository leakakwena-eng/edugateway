-- Run once as the postgres superuser, e.g.:
--   psql -U postgres -f backend/scripts/setup-database.sql
-- Tables are created by Hibernate when the app is first deployed.

CREATE USER edugateway_user WITH PASSWORD 'edugateway_pass';
CREATE DATABASE edugateway OWNER edugateway_user;
