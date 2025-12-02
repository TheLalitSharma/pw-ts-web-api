#!/bin/bash

# Playwright Test Executor Script
# Usage: ./executor.sh <GIT_REPO> <GIT_BRANCH> <ENVIRONMENT>

set -e  # Exit on error

# Parse arguments
GIT_REPO=$1
GIT_BRANCH=$2
ENVIRONMENT=$3

# Configuration
CONTAINER_NAME="playwright-tests-${ENVIRONMENT}-${BUILD_NUMBER:-local}"
NETWORK_NAME="playwright-network"
REPORTS_DIR="playwright-report"
TEST_RESULTS_DIR="test-results"
WORKSPACE=${WORKSPACE:-$(pwd)}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Validate inputs
validate_inputs() {
    log_info "Validating inputs..."
    
    if [ -z "$GIT_REPO" ] || [ -z "$GIT_BRANCH" ] || [ -z "$ENVIRONMENT" ]; then
        log_error "Missing required parameters"
        echo "Usage: $0 <GIT_REPO> <GIT_BRANCH> <ENVIRONMENT>"
        exit 1
    fi
    
    log_info "Repository: $GIT_REPO"
    log_info "Branch: $GIT_BRANCH"
    log_info "Environment: $ENVIRONMENT"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up resources..."
    
    # Stop and remove container
    if docker ps -a | grep -q "$CONTAINER_NAME"; then
        log_info "Stopping container: $CONTAINER_NAME"
        docker stop "$CONTAINER_NAME" || true
        docker rm "$CONTAINER_NAME" || true
    fi
    
    # Remove network if it exists
    if docker network ls | grep -q "$NETWORK_NAME"; then
        log_info "Removing network: $NETWORK_NAME"
        docker network rm "$NETWORK_NAME" || true
    fi
    
    log_info "Cleanup completed"
}

# Trap to ensure cleanup on exit
trap cleanup EXIT

# Create Docker network
create_network() {
    log_info "Creating Docker network: $NETWORK_NAME"
    
    if ! docker network ls | grep -q "$NETWORK_NAME"; then
        docker network create "$NETWORK_NAME"
    else
        log_warning "Network $NETWORK_NAME already exists"
    fi
}

# Start Docker container
start_container() {
    log_info "Starting Docker container: $CONTAINER_NAME"
    
    # Remove existing container if present
    docker rm -f "$CONTAINER_NAME" 2>/dev/null || true
    
    # Start container with Playwright image
    docker run -d \
        --name "$CONTAINER_NAME" \
        --network "$NETWORK_NAME" \
        -v "$WORKSPACE:/workspace" \
        -w /workspace \
        -e CI=true \
        -e ENVIRONMENT="$ENVIRONMENT" \
        mcr.microsoft.com/playwright:v1.48.0-jammy \
        tail -f /dev/null
    
    log_info "Container started successfully"
}

# Clone repository inside container
clone_repository() {
    log_info "Cloning repository: $GIT_REPO (branch: $GIT_BRANCH)"
    
    docker exec "$CONTAINER_NAME" bash -c "
        set -e
        
        # Clean existing directory if present
        rm -rf /workspace/test-code
        
        # Clone repository
        git clone --depth 1 --branch $GIT_BRANCH $GIT_REPO /workspace/test-code
        
        cd /workspace/test-code
        
        echo 'Repository cloned successfully'
        git log -1 --pretty=format:'Commit: %H%nAuthor: %an%nDate: %ad%nMessage: %s'
    "
    
    log_info "Repository cloned successfully"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    docker exec "$CONTAINER_NAME" bash -c "
        set -e
        cd /workspace/test-code
        
        # Install npm dependencies
        npm ci
        
        # Install Playwright browsers if needed
        npx playwright install --with-deps
    "
    
    log_info "Dependencies installed successfully"
}

# Execute tests
execute_tests() {
    log_info "Executing Playwright tests for environment: $ENVIRONMENT"
    
    # Run tests and capture exit code
    set +e
    docker exec "$CONTAINER_NAME" bash -c "
        cd /workspace/test-code
        
        # Set environment variable
        export TEST_ENV=$ENVIRONMENT
        
        # Run tests with environment-specific configuration
        npm run test:web -- --config=playwright.config.ts
    "
    TEST_EXIT_CODE=$?
    set -e
    
    if [ $TEST_EXIT_CODE -eq 0 ]; then
        log_info "Tests executed successfully"
    else
        log_warning "Tests completed with failures (exit code: $TEST_EXIT_CODE)"
    fi
    
    return $TEST_EXIT_CODE
}

# Copy reports from container
copy_reports() {
    log_info "Copying test reports..."
    
    # Create reports directory if not exists
    mkdir -p "$WORKSPACE/$REPORTS_DIR"
    mkdir -p "$WORKSPACE/$TEST_RESULTS_DIR"
    
    # Copy Playwright HTML report
    docker cp "$CONTAINER_NAME:/workspace/test-code/$REPORTS_DIR/." "$WORKSPACE/$REPORTS_DIR/" 2>/dev/null || log_warning "No Playwright HTML report found"
    
    # Copy test results
    docker cp "$CONTAINER_NAME:/workspace/test-code/$TEST_RESULTS_DIR/." "$WORKSPACE/$TEST_RESULTS_DIR/" 2>/dev/null || log_warning "No test results found"
    
    # Copy screenshots and videos if available
    docker cp "$CONTAINER_NAME:/workspace/test-code/test-results/." "$WORKSPACE/test-results/" 2>/dev/null || true
    
    log_info "Reports copied to workspace"
}

# Main execution
main() {
    log_info "========================================"
    log_info "Playwright Test Execution Started"
    log_info "========================================"
    
    validate_inputs
    create_network
    start_container
    clone_repository
    install_dependencies
    
    # Execute tests and capture result
    execute_tests
    TEST_RESULT=$?
    
    copy_reports
    
    log_info "========================================"
    log_info "Playwright Test Execution Completed"
    log_info "========================================"
    
    # Exit with test result code
    exit $TEST_RESULT
}

# Run main function
main