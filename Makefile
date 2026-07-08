# ============================================================================ #
#                                   HYPERTUBE                                  #
# ============================================================================ #

# Variables
DOCKER_COMPOSE	= docker compose
NAME			= hypertube

# Colors
GREEN			= \033[0;32m
RED				= \033[0;31m
YELLOW			= \033[0;33m
BLUE			= \033[0;34m
RESET			= \033[0m

# Default rule
all: up

# Build and run containers in background
up:
	@echo "$(GREEN)Starting Hypertube services in the background...$(RESET)"
	$(DOCKER_COMPOSE) up -d --build

# Run containers in foreground
run:
	@echo "$(GREEN)Running Hypertube services in the foreground...$(RESET)"
	$(DOCKER_COMPOSE) up --build

# Stop containers
down:
	@echo "$(YELLOW)Stopping Hypertube services...$(RESET)"
	$(DOCKER_COMPOSE) down

# Stop containers and remove orphans
clean:
	@echo "$(RED)Cleaning Hypertube containers...$(RESET)"
	$(DOCKER_COMPOSE) down --remove-orphans

# Full clean: Stop containers, remove volumes, networks, and ALL local images
fclean: clean
	@echo "$(RED)Performing full clean (removing volumes and images)...$(RESET)"
	$(DOCKER_COMPOSE) down -v --rmi all --remove-orphans
	@docker system prune -a --volumes -f || true

# Rebuild all containers from scratch
re: fclean all

# Show logs
logs:
	$(DOCKER_COMPOSE) logs -f

# Show status of containers
status:
	$(DOCKER_COMPOSE) ps

.PHONY: all up run down clean fclean re logs status