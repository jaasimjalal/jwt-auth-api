# JWT Auth API

A production-ready microservice for generating and validating JWT (JSON Web Tokens) using username/password credentials.

## Architecture

- **Language**: Node.js + TypeScript
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken + bcryptjs)
- **Security**: Input validation (express-validator), CORS, non-root Docker user
- **Logging**: Winston structured logging
- **Testing**: Jest + Supertest

## Local Development

### Prerequisites
- Node.js 20+
- Docker (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jaasimjalal/jwt-auth-api.git
   cd jwt-auth-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your JWT secret
   ```

4. Run the service:
   ```bash
   npm run dev
   ```

### API Endpoints

#### Health Check
```http
GET /health
```

#### Login (Generate Token)
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "1h",
    "user": {
      "id": "1",
      "username": "admin"
    }
  }
}
```

#### Validate Token
```http
POST /api/v1/auth/validate
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "decoded": {
      "sub": "1",
      "username": "admin",
      "iat": 1645123456,
      "exp": 1645127056
    }
  }
}
```

## Docker Deployment

### Build Image
```bash
docker build -t jwt-auth-api .
```

### Run Container
```bash
docker run -d --name jwt-auth-api -p 3000:3000 jwt-auth-api
```

### Using Docker Compose (if added)
```bash
docker-compose up -d
```

## Testing

### Run unit tests
```bash
npm test
```

### Run tests with coverage
```bash
npm test -- --coverage
```

## Jenkins Pipeline

The repository includes a `Jenkinsfile` that automatically:
1. Builds the Docker image
2. Stops and removes existing containers
3. Runs the container locally
4. Performs a health check

### Jenkins Credentials Required
- The pipeline uses the local Docker daemon.
- Ensure the Jenkins agent has Docker installed and running.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `JWT_SECRET` | **Required** Secret key for signing tokens | `supersecretkey` |
| `JWT_EXPIRES_IN` | Token expiry time | 1h |
| `CORS_ORIGIN` | Allowed CORS origins | * |
| `MOCK_USERS` | Credentials list `user:pass:id` | `admin:password123:1` |

## Production Considerations

1. **Change Defaults**: Update `JWT_SECRET` in production.
2. **Database**: Currently uses in-memory storage. Connect to a real database (PostgreSQL/MongoDB) for persistence.
3. **HTTPS**: Always use HTTPS in production.
4. **Secrets**: Manage secrets via a secure vault (e.g., AWS Secrets Manager).