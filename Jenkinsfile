pipeline {
    agent any

    environment {
        IMAGE_NAME = "jwt-auth-api"
        CONTAINER_NAME = "jwt-auth-api-container"
        REGISTRY_URL = "http://10.244.9.19:5000"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${IMAGE_NAME}"
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        stage('Stop & Remove Existing Container') {
            steps {
                script {
                    echo "Cleaning up existing containers..."
                    sh "docker rm -f ${CONTAINER_NAME} || true"
                }
            }
        }

        stage('Run Container Locally') {
            steps {
                script {
                    echo "Starting container: ${CONTAINER_NAME}"
                    sh "docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${IMAGE_NAME}"
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    timeout(time: 30, unit: 'SECONDS') {
                        waitUntil {
                            script {
                                try {
                                    def status = sh(
                                        script: "curl -s -o /dev/null -w \"%{http_code}\" http://localhost:3000/health",
                                        returnStdout: true
                                    ).trim()
                                    echo "Health check response code: ${status}"
                                    return status == '200'
                                } catch (Exception e) {
                                    echo "Health check failed: ${e.message}"
                                    return false
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Cleaning up..."
                sh "docker stop ${CONTAINER_NAME} || true"
                sh "docker rm ${CONTAINER_NAME} || true"
            }
        }
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}