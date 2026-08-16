-- Save as: docker/postgres-init/01-create-openfga-db.sql
-- Mounted into /docker-entrypoint-initdb.d — Postgres runs every script in
-- that folder automatically, but ONLY the first time the container starts
-- with an empty data volume. If you already ran `docker compose up` before
-- adding this file, delete the pgdata volume once (docker compose down -v)
-- so it re-triggers, or just run this manually inside the container.
CREATE DATABASE openfga;
