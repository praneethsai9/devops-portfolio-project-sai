# DevOps Portfolio Project

A comprehensive portfolio demonstrating enterprise-level DevOps practices using:
- **CI/CD**: Azure DevOps Pipelines
- **Containerization**: Docker & Azure Container Registry
- **Orchestration**: Kubernetes & AKS
- **Infrastructure**: Terraform
- **Monitoring**: Azure Monitor
- **Security**: Image scanning, Code quality analysis

## Quick Start

### Prerequisites
- Node.js 16+ and npm 7+
- Git
- Azure account (for cloud deployment)
- GitHub account

### Local Development
```bash
cd src
npm install
npm start
```

Server runs at: http://localhost:3000

### API Endpoints

- `GET /health` - Health check
- `GET /ready` - Readiness check
- `GET /api/items` - Get all items
- `POST /api/items` - Create item
- `GET /api/items/:id` - Get specific item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Testing
```bash
cd src
npm test
```

## Project Structure