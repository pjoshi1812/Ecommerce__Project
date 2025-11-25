
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
    args: ["--storage-driver=overlay2"]
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

    stages {

        /* 1. INSTALL + BUILD FRONTEND */
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

        /* 2. INSTALL BACKEND */
        stage('Install Backend') {
            steps {
                dir('backend') {
                    container('node') {
                        sh '''
                            npm install
                        '''
                    }
                }
            }
        }

        /* 3. BUILD DOCKER IMAGES */
        stage('Build Docker Images') {
            steps {
                container('dind') {
                    sh '''
                        sleep 10

                        # Correct build contexts
                        docker build -t ecommerce-frontend:latest -f frontend/Dockerfile frontend/
                        docker build -t ecommerce-backend:latest -f backend/Dockerfile backend/
                    '''
                }
            }
        }

        /* 4. SONARQUBE */
        stage('SonarQube Analysis') {
    steps {
        container('sonar-scanner') {
            sh '''
                sonar-scanner \
                -Dsonar.projectKey=Ecommerce-Project2401077 \
                -Dsonar.sources=frontend,backend \
                -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                -Dsonar.token=sqp_f3125bc1a5232a0f26c25425a4185377bfa05370
            '''
        }
    }
}


        /* 5. LOGIN TO NEXUS */
        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    sh '''
                       docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
  -u student -p Imcc@2025

                    '''
                }
            }
        }

        /* 6. PUSH IMAGES TO NEXUS */
        stage('Push to Nexus') {
            steps {
                container('dind') {
                    sh '''
                        docker tag ecommerce-frontend:latest nexus.imcc.com:5000/ecommerce-2401077/ecommerce-frontend:v1
                        docker tag ecommerce-backend:latest nexus.imcc.com:5000/ecommerce-2401077/ecommerce-backend:v1

                        docker push nexus.imcc.com:5000/ecommerce-2401077/ecommerce-frontend:v1
                        docker push nexus.imcc.com:5000/ecommerce-2401077/ecommerce-backend:v1
                    '''
                }
            }
        }

        /* 7. DEPLOY TO K8S */
        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl apply -f k8s/deployment.yaml
                        kubectl apply -f k8s/service.yaml

                        kubectl rollout status deployment/ecommerce-frontend-2401077 -n ecommerce
                        kubectl rollout status deployment/ecommerce-backend-2401077 -n ecommerce
                    '''
                }
            }
        }
    }
}
// pipeline {
//     agent {
//         kubernetes {
//             yaml '''
// apiVersion: v1
// kind: Pod
// spec:
//   containers:

//   - name: node
//     image: mirror.gcr.io/library/node:20
//     command: ['cat']
//     tty: true

//   - name: sonar-scanner
//     image: sonarsource/sonar-scanner-cli
//     command: ['cat']
//     tty: true

//   - name: kubectl
//     image: bitnami/kubectl:latest
//     command: ['cat']
//     tty: true
//     env:
//     - name: KUBECONFIG
//       value: /kube/config
//     volumeMounts:
//     - name: kubeconfig-secret
//       mountPath: /kube/config
//       subPath: kubeconfig

//   - name: dind
//     image: docker:dind
//     args:
//       - "--storage-driver=overlay2"
//       - "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
//     securityContext:
//       privileged: true
//     env:
//     - name: DOCKER_TLS_CERTDIR
//       value: ""

//   volumes:
//   - name: kubeconfig-secret
//     secret:
//       secretName: kubeconfig-secret
// '''
//         }
//     }

//     stages {

//         /* 1. INSTALL + BUILD FRONTEND */
//         stage('Install + Build Frontend') {
//             steps {
//                 dir('frontend') {
//                     container('node') {
//                         sh '''
//                             npm install
//                             npm run build
//                         '''
//                     }
//                 }
//             }
//         }

//         /* 2. INSTALL BACKEND */
//         stage('Install Backend') {
//             steps {
//                 dir('backend') {
//                     container('node') {
//                         sh '''
//                             npm install
//                         '''
//                     }
//                 }
//             }
//         }

//         /* 3. BUILD DOCKER IMAGES */
//         stage('Build Docker Images') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         sleep 10
//                         docker build -t ecommerce-frontend:latest -f frontend/Dockerfile frontend/
//                         docker build -t ecommerce-backend:latest -f backend/Dockerfile backend/
//                     '''
//                 }
//             }
//         }

//         /* 4. SONARQUBE */
//         stage('SonarQube Analysis') {
//             steps {
//                 container('sonar-scanner') {
//                     sh '''
//                         sonar-scanner \
//                         -Dsonar.projectKey=Ecommerce-Project2401077 \
//                         -Dsonar.sources=frontend,backend \
//                         -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
//                         -Dsonar.token=sqp_f3125bc1a5232a0f26c25425a4185377bfa05370
//                     '''
//                 }
//             }
//         }

//         /* 5. LOGIN TO NEXUS */
//         stage('Login to Nexus Registry') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         docker login http://nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
//                             -u student -p Imcc@2025
//                     '''
//                 }
//             }
//         }

//         /* 6. PUSH IMAGES TO NEXUS */
//        stage('Push to Nexus') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         # Tag images correctly inside project folder
//                         docker tag ecommerce-frontend:latest \
//                         nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/ecommerce-2401077/ecommerce-frontend:v1

//                         docker tag ecommerce-backend:latest \
//                         nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/ecommerce-2401077/ecommerce-backend:v1

//                         # Push to Nexus registry
//                         docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/ecommerce-2401077/ecommerce-frontend:v1
//                         docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/ecommerce-2401077/ecommerce-backend:v1
//                     '''
//                 }
//             }
//         }


//         /* 7. DEPLOY TO K8S */
//         /* 7. DEPLOY TO K8S */
//     stage('Deploy to Kubernetes') {
//         steps {
//             container('kubectl') {
//                 sh '''
//                     # Apply manifests
//                     kubectl apply -f k8s/deployment.yaml
//                     kubectl apply -f k8s/service.yaml

//                     # Wait for deployment rollout
//                     kubectl rollout status deployment/ecommerce-deployment -n 2401077 --timeout=120s
//                 '''
//             }
//         }
//     }

//     }
// }
