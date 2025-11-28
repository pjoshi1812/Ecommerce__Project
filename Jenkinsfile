pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: node
    image: mirror.gcr.io/library/node:20
    command: ['cat']
    tty: true

  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ['cat']
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ['cat']
    tty: true
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: dind
    image: docker:dind
    args: ["--storage-driver=overlay2", "--insecure-registry=nexus.imcc.com:8085"]
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""

  volumes:
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    environment {
        NAMESPACE = "ecommerce-2401077"
        NEXUS     = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/ecommerce-2401077"
    }

    stages {

        stage("CHECK") {
            steps {
                echo "Lightweight Jenkinsfile started for ${NAMESPACE}"
            }
        }

        stage('Install + Build Frontend') {
            steps {
                dir('frontend') {
                    container('node') {
                        sh '''
                            npm install
                            npm run build
                        '''
                    }
                }
            }
        }

        stage('Install Backend') {
            steps {
                dir('backend') {
                    container('node') {
                        sh 'npm install'
                    }
                }
            }
        }

        stage("Build Docker Images") {
            steps {
                container("dind") {
                    sh """
                        
                        docker build -t ecommerce-frontend:latest -f frontend/Dockerfile frontend/
                        docker build -t ecommerce-backend:latest  -f backend/Dockerfile  backend/
                    """
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=Ecommerce-Project2401077 \
                            -Dsonar.sources=backend,frontend \
                            -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                            -Dsonar.token=sqp_f3125bc1a5232a0f26c25425a4185377bfa05370
                    '''
                }
            }
        }

        stage("Login to Nexus") {
            steps {
                container("dind") {
                    sh "docker login ${NEXUS} -u student -p Imcc@2025"
                }
            }
        }

        stage("Push Images") {
            steps {
                container("dind") {
                    sh """
                        docker tag ecommerce-frontend:latest ${NEXUS}/ecommerce-frontend:v1
                        docker tag ecommerce-backend:latest  ${NEXUS}/ecommerce-backend:v1
                        docker push ${NEXUS}/ecommerce-frontend:v1
                        docker push ${NEXUS}/ecommerce-backend:v1
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "===== Using kubeconfig ====="
                        ls -l /kube || true
                        cat /kube/config || true

                        echo "===== Applying Deployment ====="
                        kubectl apply -n ${NAMESPACE} -f k8s/deployment.yaml

                        echo "===== Applying Service ====="
                        kubectl apply -n ${NAMESPACE} -f k8s/service.yaml

                        echo "===== Rollout Status ====="
                        kubectl rollout status deployment/ecommerce-frontend -n ${NAMESPACE} --timeout=60s || true
                        kubectl rollout status deployment/ecommerce-backend -n ${NAMESPACE} --timeout=60s || true

                        echo "===== Pods ====="
                        kubectl get pods -n ${NAMESPACE}
                    '''
                }
            }
        }

    }
}