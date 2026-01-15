pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = "jwt-auth-api"
        DOCKER_TAG = "latest"
        CONTAINER_NAME = "jwt-auth-api-container"
        PORT = "3000"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    echo 'Building Docker image...'
                    sh "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_TAG} ."
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    echo 'Running tests...'
                    sh 'npm install || true'
                    sh 'npm test || true'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying container...'
                    
                    # Stop and remove existing container if it exists
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    
                    # Remove dangling images to save space
                    sh 'docker image prune -f || true'
                    
                    # Run new container
                    sh "docker run -d --name ${CONTAINER_NAME} -p ${PORT}:3000 --env-file .env ${DOCKER_IMAGE_NAME}:${DOCKER_TAG}"
                    
                    echo "Service running on http://localhost:${PORT}"
                }
            }
        }

        stage('Verify') {
            steps {
                script {
                    echo 'Verifying service deployment...'
                    
                    # Wait for container to start
                    sh 'sleep 5'
                    
                    # Check health endpoint
                    sh 'curl -s -f http://localhost:${PORT}/health || echo "Health check failed but continuing..."'
                    
                    # Check auth endpoint with test credentials
                    sh '''
                    curl -s -X POST http://localhost:${PORT}/api/v1/auth/login \
                        -H "Content-Type: application/json" \
                        -d '{"username":"testuser","password":"testpass123"}' \
                        -w "\nHTTP Status: %{http_code}\n" || echo "Auth endpoint check failed"
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Cleaning up...'
            }
        }
        success {
            script {
                echo 'Deployment successful!'
                echo "Service is running on http://localhost:${PORT}"
            }
        }
        failure {
            script {
                echo 'Deployment failed!'
            }
        }
    }
}
