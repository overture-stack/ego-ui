def dockerHubRepo = "overture/ego-ui"
def dockerRepo = "ghcr.io/overture-stack/ego-ui" 
def gitRepo = "github.com/overture-stack/ego-ui"
def commit = "UNKNOWN"
def version = "UNKNOWN"

pipeline {
    agent {
        kubernetes {
            label 'ego-ui-executor'
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:12.6.0
    tty: true
  - name: docker
    image: docker:18-git
    tty: true
    env:
    - name: DOCKER_HOST
      value: tcp://localhost:2375
    - name: HOME
      value: /home/jenkins/agent
  - name: dind-daemon
    image: docker:18.06-dind
    securityContext:
      privileged: true
      runAsUser: 0
    volumeMounts:
    - name: docker-graph-storage
      mountPath: /var/lib/docker
  securityContext:
    runAsUser: 1000
  volumes:
  - name: docker-graph-storage
    emptyDir: {}
"""
        }
    }
    stages {
        stage('Prepare') {
            steps {
                script {
                    commit = sh(returnStdout: true, script: 'git describe --always').trim()
                }
                script {
                    version = sh(returnStdout: true, script: 'cat ./package.json | grep version | cut -d \':\' -f2 | sed -e \'s/"//\' -e \'s/",//\' | head -1').trim()
                }
            }
        }
        stage('Test') {
            steps {
                container('node') {
                    sh "yarn install --frozen-lockfile"
                    sh "CI=true yarn test --coverage"
                }
            }
        }
        stage('Build') {
            steps {
                container('node') {
                    sh "yarn install --frozen-lockfile"
                    sh "yarn build"
                }
                container('docker') {
                    sh "docker build --build-arg=COMMIT=${commit} --network=host -f Dockerfile . -t ${dockerRepo}:${commit} -t ${dockerRepo}:${commit} -t ${dockerHubRepo}:${commit} -t ${dockerHubRepo}:${commit}"
                }
                
            }
        }
        stage('Publish Develop') {
            when {
                branch "develop"
            }
            steps {
                container('docker') {
                    withCredentials([usernamePassword(credentialsId:'OvertureBioGithub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh 'docker login ghcr.io -u $USERNAME -p $PASSWORD'
                    }
                    sh "docker tag ${dockerRepo}:${commit} ${dockerRepo}:edge"
                    sh "docker push ${dockerRepo}:${commit}"
                    sh "docker push ${dockerRepo}:edge"
               }
                container('docker') {
                    withCredentials([usernamePassword(credentialsId:'OvertureDockerHub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh 'docker login -u $USERNAME -p $PASSWORD'
                    }
                    sh "docker tag ${dockerHubRepo}:${commit} ${dockerHubRepo}:edge"
                    sh "docker push ${dockerHubRepo}:${commit}"
                    sh "docker push ${dockerHubRepo}:edge"
                }
            }
        }
        stage('Release & Tag') {
            when {
                branch "master"
            }
            steps {
                container('docker') {
                    withCredentials([usernamePassword(credentialsId: 'OvertureBioGithub', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        sh "git tag ${version}"
                        sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@${gitRepo} --tags"
                    }
                    withCredentials([usernamePassword(credentialsId:'OvertureBioGithub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh 'docker login ghcr.io -u $USERNAME -p $PASSWORD'
                    }
                    sh "docker tag ${dockerRepo}:${commit} ${dockerRepo}:${version}"
                    sh "docker tag ${dockerRepo}:${commit} ${dockerRepo}:latest"
                    sh "docker push ${dockerRepo}:${version}"
                    sh "docker push ${dockerRepo}:latest"
                }
                container('docker') {
                    withCredentials([usernamePassword(credentialsId:'OvertureDockerHub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh 'docker login -u $USERNAME -p $PASSWORD'
                    }
                    sh "docker tag ${dockerHubRepo}:${commit} ${dockerHubRepo}:${version}"
                    sh "docker tag ${dockerHubRepo}:${commit} ${dockerHubRepo}:latest"
                    sh "docker push ${dockerHubRepo}:${version}"
                    sh "docker push ${dockerHubRepo}:latest"
                }
            }
        }
    }
}
