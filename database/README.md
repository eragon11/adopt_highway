# Continuous Integration and Delivery for Database

## Summary

This directory contains a db-migrate database application for automatically executing SQL files in a SQL Server database.

## Quick Start

- Go to the project root directory.
- Run the build.ps1 script with rebuild to create all of the containers and run the database.

```powershell
> .\build.ps1 rebuild
```

## Explanation

This project expects a Microsoft SQL Server 2019 database. The initial database is created using the build script in the root of the project.

Each migration will contain a single JavaScript file, an up SQL, and a down SQL. Migrations use a JavaScript file that manages the execution of two SQL files - `...up.sql` files are for migrating new features. `...down.sql` files rolls back the "up" file's changes to restore to the last version of the database. If up adds a new ADDRESS1 column to the Users table, then down would remove ADDRESS1. The SQL files are contained in \migrations\sqls folder.

Migrations are executed in alphanumerical order, so the naming convention will begin with a timestamp in the form of "YYYYMMDDSS". This ensures that SQL migrations are executed in order. Migrations are then logged in an audit table - dbo.migrations - to prevent duplicate execution. However, it is recommended that SQL scripts be written to prevent errors, if executed multiple times.

> NOTE: It is important that SQL scripts be creating idempotently.

Any file can be executed multiple times with no side-effects or errors. Therefore, alter table statements check for the existence of any column, index, or key and only apply when that change has not yet been made.

Migrations are creating using [db-migrate's create command](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/#create) from a command prompt. They are created in the migrations folder.

```bash
db-migrate create create-road-segment --sql-file true --config .\migrate-database.js
```
## Sample Data

Sample data is DML insert data for creating repeatable test data. Sample data migrations are created in the migrations\sample-data folder. The SQL scripts for sample data are created in migrations\sample-data\sqls.

## Database Requirements

All database environments must have the older AAH legacy database installed as `aah_legacy`. This database will migrate over data during the initial automated deployment.

Each database server will need an `aah` database with ArcGIS schema objects.

Each database server will need a SQL login as `aah_dataowner_{ENVIRONMENT}` where {ENVIRONMENT} is replaced with the current environment - dev, uat, preprod or prod. In the `aah` database, this login should be mapped to a user named `aah_{ENVIRONMENT}`. This user also needs to be defined with a default schema with the same name. In the `aah` database, the user should be a member of the following roles: db_ddlamin, db_datareader, db_datawriter. They should have grants to CREATE TABLE, alter schema on their named schema, and denied alter on dbo schema. The following is the `create-admin-user.sql` contents describing these actions as created for the development sandbox environment.

```sql
CREATE USER [aah] FOR LOGIN [aah_dataowner_dev] WITH DEFAULT_SCHEMA = [aah]; 
ALTER ROLE [db_ddladmin] ADD MEMBER [aah];
ALTER ROLE [db_datareader] ADD MEMBER [aah];
ALTER ROLE [db_datawriter] ADD MEMBER [aah]];
GRANT CREATE TABLE TO [aah]; 
GRANT ALTER ON SCHEMA::[aah] TO [aah];
DENY ALTER ON SCHEMA::[dbo] TO [aah]; 
```

Each database server will also need a SQL login mapped to a restricted user for the API. This user will have memberships in db_datareader, db_datawriter. 

## Important

- Migration names must begin with a 14 digit timestamp and hyphenated name. There is a regular expression that fails when this is not properly created. 
- Use the `db-migrate create` command to ensure proper migration creation of the JavaScript and SQL files.
