#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --file=/tmp/db-init/create-database.sql

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "app" --file=/tmp/db-init/create-extensions.sql

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "app" --file=/tmp/db-init/create-structure.sql

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "app" --file=/tmp/db-init/create-functions.sql

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "app" --file=/tmp/db-init/insert-data.sql

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "app" --file=/tmp/db-init/create-user.sql
cp /tmp/db-init/pg_hba.conf /var/lib/postgresql/data/pg_hba.conf
