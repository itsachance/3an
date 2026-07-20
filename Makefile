DB_PATH=./trean.db
MIG_DIR=./db/migrations
BIN_NAME=trean
IMAGE_NAME=trean:latest
CONTAINER_ENGINE=podman
VERSION ?= dev

.PHONY: all build clean container-build container-run container-clean container-push ts-compile db-status db-up db-down db-redo db-create

all: build

build: ts-compile
	@echo "Building Go binary..."
	@go build -o $(BIN_NAME) ./cmd/web/

clean:
	@echo "Removing Go binary..."
	@rm $(BIN_NAME)
	@echo "Removing .js files..."
	@rm ui/static/*.js

container-build: ts-compile
	@echo "Building container image using $(CONTAINER_ENGINE)..."
	@$(CONTAINER_ENGINE) build --target builder -t trean-builder:latest -f Containerfile .
	@$(CONTAINER_ENGINE) build -f Containerfile -t $(IMAGE_NAME) .

container-run: container-build
	@echo "Running container $(IMAGE_NAME)..."
	@$(CONTAINER_ENGINE) volume exists trean-data || $(CONTAINER_ENGINE) volume create trean-data
	@echo "Running migrations..."
	@$(CONTAINER_ENGINE) run --rm -u 65534 -v trean-data:/data -v $(PWD)/db/migrations:/migrations --entrypoint /go/bin/goose trean-builder:latest -dir /migrations sqlite3 /data/trean.db up
	@$(CONTAINER_ENGINE) run -d -p 5500:5500 -v trean-data:/data -e DB_PATH=/data/trean.db localhost/$(IMAGE_NAME)

container-clean:
	@echo "Cleaning up container $(IMAGE_NAME)..."
	@$(CONTAINER_ENGINE) rm -f $$($(CONTAINER_ENGINE) ps -aq --filter ancestor=localhost/$(IMAGE_NAME)) 2>/dev/null || true
	@$(CONTAINER_ENGINE) rmi localhost/$(IMAGE_NAME) 2>/dev/null || true
	@$(CONTAINER_ENGINE) rmi trean-builder:latest 2>/dev/null || true
	@$(CONTAINER_ENGINE) volume rm trean-data 2>/dev/null || true

container-push: container-build
	@echo "Pushing $(IMAGE_NAME) as $(VERSION)..."
	@$(CONTAINER_ENGINE) tag localhost/$(IMAGE_NAME) ghcr.io/itsachance/3an:$(VERSION)
	@$(CONTAINER_ENGINE) tag localhost/$(IMAGE_NAME) ghcr.io/itsachance/3an:latest
	@$(CONTAINER_ENGINE) push ghcr.io/itsachance/3an:$(VERSION)
	@$(CONTAINER_ENGINE) push ghcr.io/itsachance/3an:latest
	# Builder-image
	@echo "Pushing trean-builder as $(VERSION)..."
	@$(CONTAINER_ENGINE) tag trean-builder:latest ghcr.io/itsachance/3an-builder:$(VERSION)
	@$(CONTAINER_ENGINE) tag trean-builder:latest ghcr.io/itsachance/3an-builder:latest
	@$(CONTAINER_ENGINE) push ghcr.io/itsachance/3an-builder:$(VERSION)
	@$(CONTAINER_ENGINE) push ghcr.io/itsachance/3an-builder:latest

ts-compile:
	@echo "Compiling TypeScript..."
	@$(CONTAINER_ENGINE) run --rm -v $(PWD)/ui/static:/ui/static -w /ui/static node:22-alpine sh -c "npm install -g typescript && tsc"

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
