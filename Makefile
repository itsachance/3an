DB_PATH=./trean.db
MIG_DIR=./db/migrations
BIN_NAME=trean
IMAGE_NAME=trean:latest
CONTAINER_ENGINE=podman

.PHONY: all build clean container db-status db-up db-down db-redo db-create

all: build

build:
	@echo "Building Go binary..."
	@go build -o $(BIN_NAME) ./cmd/web/

clean:
	@echo "Removing Go binary..."
	@rm $(BIN_NAME)

container:
	@echo "Building container image using $(CONTAINER_ENGINE)..."
	@$(CONTAINER_ENGINE) build -f Containerfile -t $(IMAGE_NAME) .

db-status:
	@goose -dir $(MIG_DIR) sqlite3 $(DB_PATH) status

db-up:
	@goose -dir $(MIG_DIR) sqlite3 $(DB_PATH) up

db-down:
	@goose -dir $(MIG_DIR) sqlite3 $(DB_PATH) down

db-redo:
	@goose -dir $(MIG_DIR) sqlite3 $(DB_PATH) redo

# Usage: make db-create name=add_billing
db-create:
	@goose -dir $(MIG_DIR) create $(name) sql
