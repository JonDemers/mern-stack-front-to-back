pipeline {
    agent none
    environment {
        DOCKER_CREDENTIAL = credentials('dockerPushRegistryCredential')
    }
    stages {
        stage('Build and Deploy') {
            agent any
            steps {
                sh "ls -ltrA ; ./build-and-deploy.sh"
            }
        }
    }
}