pipeline {
  agent any
  stages {
    stage('Automation testing ') {
      environment {
        ECS_CLUSTER = 'vote-app'
        ECS_REGION = 'east-us-1'
      }
      parallel {
        stage('Linux testing') {
          steps {
            sh 'echo hello'
          }
        }

        stage('windows test') {
          steps {
            sh 'echo hii'
          }
        }

      }
    }

  }
}