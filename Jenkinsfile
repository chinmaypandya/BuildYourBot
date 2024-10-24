pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('chinmaypandya')
        DOCKER_PASSWORD = credentials('docker-password') // Jenkins credential ID
    }

    triggers {
        // Trigger the job when there is a change on GitHub (push events)
        githubPush()

        // Trigger the job for pull request events (using a webhook)
        genericTrigger(
            causeString: 'Triggered by GitHub Pull Request',
            token: 'your-webhook-token', // GitHub webhook token
            printContributedVariables: true,
            printPostContent: true,
            regexpFilterText: '$request_body',
            regexpFilterExpression: '.*"action":"opened".*'
        )
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'test/jenkins', url: 'https://github.com/chinmaypandya/BuildYourBot.git'
                // script {
                //     // Fetch all branches
                //     def branches = sh(
                //         script: "git ls-remote --heads https://github.com/yourusername/your-repo.git | awk '{print \$2}'",
                //         returnStdout: true
                //     ).trim().tokenize('\n')

                //     // Find the first branch that starts with 'test/'
                //     def branch = branches.find { it.contains('refs/heads/test/') }

                //     if (branch) {
                //         // Checkout the found branch
                //         git branch: branch.replace('refs/heads/', ''), url: 'https://github.com/yourusername/your-repo.git'
                //     } else {
                //         error("No branch found starting with 'test/'")
                //     }
                // }

                // Check out the branch from the repository
                // checkout([$class: 'GitSCM',
                //           branches: [[name: 'test/*']],
                //           userRemoteConfigs: [[
                //              url: 'https://github.com/chinmaypandya/BuildYourBot.git',
                //              credentialsId: 'github-account'
                //           ]]
                // ])
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build AI Service') {
                    steps {
                        script {
                            try {
                                sh 'docker build -t ${DOCKER_USERNAME}/buildyourbot-ai-service ./ai'
                            } catch (Exception e) {
                                echo "Build failed for AI Service: ${e.getMessage()}"
                            }
                        }
                    }
                }

                stage('Build Web Service') {
                    steps {
                        script {
                            try {
                                sh 'docker build -t ${DOCKER_USERNAME}/buildyourbot-web-service ./web'
                            } catch (Exception e) {
                                echo "Build failed for Web Service: ${e.getMessage()}"
                            }
                        }
                    }
                }

                stage('Build DBConn Service') {
                    steps {
                        script {
                            try {
                                sh 'docker build -t ${DOCKER_USERNAME}/buildyourbot-dbconn-service ./dbconn'
                            } catch (Exception e) {
                                echo "Build failed for DBConn Service: ${e.getMessage()}"
                            }
                        }
                    }
                }

                stage('Build Redis Service') {
                    steps {
                        script {
                            try {
                                sh 'docker build -t ${DOCKER_USERNAME}/buildyourbot-redis-service ./redis'
                            } catch (Exception e) {
                                echo "Build failed for Redis Service: ${e.getMessage()}"
                            }
                        }
                    }
                }
            }
        }

        stage('Run Services with Docker Compose') {
            steps {
                script {
                    try {
                        sh 'docker compose up --detach --remove-orphans'
                    } catch (Exception e) {
                        echo "Failed to start services: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Health Checks') {
            parallel {
                stage('Health Check Web Service') {
                    steps {
                        script {
                            checkHealth('http://localhost:3001')
                        }
                    }
                }

                stage('Health Check AI Service') {
                    steps {
                        script {
                            checkHealth('http://localhost:8000/v1/chat/health')
                        }
                    }
                }
            }
        }

        stage('Show Running Containers and Logs') {
            steps {
                script {
                    sh 'docker ps'
                    sh 'docker-compose logs --tail=1000'
                }
            }
        }

        stage('Shut Down Services') {
            steps {
                script {
                    sh 'docker compose down'
                }
            }
        }

        stage('Push Docker Images') {
            parallel {
                stage('Push AI Service') {
                    steps {
                        script {
                            if (env.BUILD_STATUS == 'SUCCESS') {
                                sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                                sh 'docker push ${DOCKER_USERNAME}/buildyourbot-ai-service'
                            }
                        }
                    }
                }

                stage('Push Web Service') {
                    steps {
                        script {
                            if (env.BUILD_STATUS == 'SUCCESS') {
                                sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                                sh 'docker push ${DOCKER_USERNAME}/buildyourbot-web-service'
                            }
                        }
                    }
                }
            }
        }
    }
}

// Function to perform health check
def checkHealth(url) {
    def maxAttempts = 5
    def waitTime = 2

    for (def attempt = 1; attempt <= maxAttempts; attempt++) {
        echo "Attempting health check at ${url} (Attempt ${attempt})..."
        def response = sh(script: "curl -S -w '%{http_code}' -o response.txt ${url}", returnStdout: true).trim()

        if (response == '200') {
            echo "${url} is healthy."
            return
        } else {
            echo "${url} returned status code: ${response}"
            if (attempt < maxAttempts) {
                echo "Retrying in ${waitTime} seconds..."
                sleep(waitTime)
                waitTime *= 2 // Exponential backoff
            }
        }
    }
    error("${url} did not start successfully after ${maxAttempts} attempts.")
}
