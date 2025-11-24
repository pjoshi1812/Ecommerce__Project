// pipeline {
//     agent {
//         kubernetes {
//             yaml '''
// apiVersion: v1
// kind: Pod
// spec:
//   containers:

//   - name: node
//     image: node:18
//     command: ["cat"]
//     tty: true

//   - name: sonar-scanner
//     image: sonarsource/sonar-scanner-cli
//     command: ["cat"]
//     tty: true

//   - name: kubectl
//     image: bitnami/kubectl:latest
//     command: ["cat"]
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
//     args: ["--storage-driver=overlay2"]
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

//     environment {
//         IMAGE_NAME = "2401199/ecommerce"
//         IMAGE_TAG  = "v1"
//         NEXUS_URL  = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
//         SONAR_URL  = "http://sonarqube.imcc.com"
//     }

//     stages {

//         stage('Checkout Code') {
//             steps {
//                 checkout scm
//             }
//         }

//         stage('Install + Build Frontend') {
//             steps {
//                 container('node') {
//                     dir('frontend') {
//                         sh '''
//                             npm install
//                             npm run build
//                         '''
//                     }
//                 }
//             }
//         }

//         stage('Install Backend') {
//             steps {
//                 container('node') {
//                     dir('backend') {
//                         sh '''
//                             npm install
//                         '''
//                     }
//                 }
//             }
//         }

//         stage('Copy Frontend → Backend for Docker build') {
//             steps {
//                 sh '''
//                     rm -rf backend/public || true
//                     mkdir -p backend/public
//                     cp -r frontend/build/* backend/public/
//                 '''
//             }
//         }

//         stage('Build Docker Image') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         sleep 10
//                         docker build -t ${IMAGE_NAME}:${IMAGE_TAG} backend
//                     '''
//                 }
//             }
//         }

//         stage('SonarQube Analysis') {
//             steps {
//                 container('sonar-scanner') {
//                     sh '''
//                         sonar-scanner \
//                         -Dsonar.projectKey=Ecommerce-Project2401077 \
//                         -Dsonar.sources=. \
//                         -Dsonar.host.url=${SONAR_URL} \
//                         -Dsonar.login=sqp_f3125bc1a5232a0f26c25425a4185377bfa05370
//                     '''
//                 }
//             }
//         }

//         stage('Login to Nexus Registry') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         docker login ${NEXUS_URL} -u admin -p Changeme@2025
//                     '''
//                 }
//             }
//         }

//         stage('Push Image to Nexus') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${NEXUS_URL}/${IMAGE_NAME}:${IMAGE_TAG}
//                         docker push ${NEXUS_URL}/${IMAGE_NAME}:${IMAGE_TAG}
//                     '''
//                 }
//             }
//         }

//         stage('Deploy to Kubernetes') {
//             steps {
//                 container('kubectl') {
//                     sh '''
//                         kubectl apply -f k8s/deployment.yaml
//                         kubectl apply -f k8s/service.yaml
//                         kubectl rollout status deployment/ecommerce-deployment -n 2401199
//                     '''
//                 }
//             }
//         }
//     }
// }
pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: node
    image: node:18
    command: ["cat"]
    tty: true

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

    environment {
        IMAGE_NAME = "2401199/ecommerce"
        IMAGE_TAG  = "v1"
        NEXUS_URL  = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        SONAR_URL  = "http://sonarqube.imcc.com"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                container('node') {
                    dir('frontend') {
                        sh '''
                            npm install
                            npm run build
                        '''
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                container('node') {
                    dir('backend') {
                        sh '''
                            npm install
                        '''
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        sleep 5
                        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    '''
                }
            }
        }

        stage('SonarQube Scan') {
            steps {
                container('sonar-scanner') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=Ecommerce-Project2401077 \
                        -Dsonar.host.url=${SONAR_URL} \
                        -Dsonar.login=sqp_f3125bc1a5232a0f26c25425a4185377bfa05370 \
                        -Dsonar.sources=.
                    '''
                }
            }
        }

        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker login ${NEXUS_URL} -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Push Image to Nexus') {
            steps {
                container('dind') {
                    sh '''
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${NEXUS_URL}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${NEXUS_URL}/${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl apply -f k8s/deployment.yaml
                        kubectl apply -f k8s/service.yaml
                    '''
                }
            }
        }
    }
}
