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
    command: ["cat"]
    tty: true
    resources:
      requests:
        cpu: "200m"
        memory: "512Mi"
      limits:
        cpu: "500m"
        memory: "1Gi"

  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
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
    args:
      - "--storage-driver=overlay2"
      - "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    resources:
      requests:
        cpu: "200m"
        memory: "512Mi"
      limits:
        cpu: "500m"
        memory: "1Gi"

  - name: jnlp
    image: jenkins/inbound-agent:3309.v27b_9314fd1a_4-1

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

        stage("Install + Build Frontend") {
            steps {
                dir("frontend") {
                    container("node") {
                        sh """
                            # Prefer npm ci if package-lock.json exists
                            if [ -f package-lock.json ]; then
                              npm ci || npm install --legacy-peer-deps
                            else
                              npm install --legacy-peer-deps
                            fi

                            export PATH=\$PATH:./node_modules/.bin
                            npm run build
                        """
                    }
                }
            }
        }

        stage("Install Backend") {
            steps {
                dir("backend") {
                    container("node") {
                        sh """
                            if [ -f package-lock.json ]; then
                              npm ci || npm install --legacy-peer-deps
                            else
                              npm install --legacy-peer-deps
                            fi
                        """
                    }
                }
            }
        }

        stage("Build Docker Images") {
            steps {
                container("dind") {
                    sh """
                        sleep 5
                        docker build -t ecommerce-frontend:latest -f frontend/Dockerfile frontend/
                        docker build -t ecommerce-backend:latest  -f backend/Dockerfile  backend/
                    """
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

        stage("Deploy to Kubernetes") {
            steps {
                container("kubectl") {
                    sh """
                        kubectl apply -n ${NAMESPACE} -f k8s/deployment.yaml
                        kubectl apply -n ${NAMESPACE} -f k8s/service.yaml

                        # IMPORTANT: name must match metadata.name in deployment.yaml
                        kubectl rollout status deployment/ecommerce-backend -n ${NAMESPACE} --timeout=180s
                    """
                }
            }
        }

    }
}