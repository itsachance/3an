DB_PATH=./trean.db
MIG_DIR=./db/migrations

status:
	@goose -dir $(MIG_DIR) sqlite3 $(DB_PATH) status

up:
	@goose -dir $(MIG_DIR) sqlite3 $(DB_PATH) up

down:
	@goose -dir $(MIG_DIR) sqlite3 $(DB_PATH) down

redo:
	@goose -dir $(MIG_DIR) sqlite3 $(DB_PATH) redo

# Usage: make create name=add_billing
create:
	@goose -dir $(MIG_DIR) create $(name) sql
