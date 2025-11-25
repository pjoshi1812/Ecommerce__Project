
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

//                         # Correct build contexts
//                         docker build -t ecommerce-frontend:latest -f frontend/Dockerfile frontend/
//                         docker build -t ecommerce-backend:latest -f backend/Dockerfile backend/
//                     '''
//                 }
//             }
//         }

//         /* 4. SONARQUBE */
//         stage('SonarQube Analysis') {
//     steps {
//         container('sonar-scanner') {
//             sh '''
//                 sonar-scanner \
//                 -Dsonar.projectKey=Ecommerce-Project2401077 \
//                 -Dsonar.sources=frontend,backend \
//                 -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
//                 -Dsonar.token=sqp_f3125bc1a5232a0f26c25425a4185377bfa05370
//             '''
//         }
//     }
// }


//         /* 5. LOGIN TO NEXUS */
//         stage('Login to Nexus Registry') {
//             steps {
//                 container('dind') {
//                     sh '''
//                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
//   -u admin -p Changeme@2025

//                     '''
//                 }
//             }
//         }

//         /* 6. PUSH IMAGES TO NEXUS */
//         stage('Push to Nexus') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         docker tag ecommerce-frontend:latest nexus.imcc.com:5000/ecommerce-2401077/ecommerce-frontend:v1
//                         docker tag ecommerce-backend:latest nexus.imcc.com:5000/ecommerce-2401077/ecommerce-backend:v1

//                         docker push nexus.imcc.com:5000/ecommerce-2401077/ecommerce-frontend:v1
//                         docker push nexus.imcc.com:5000/ecommerce-2401077/ecommerce-backend:v1
//                     '''
//                 }
//             }
//         }

//         /* 7. DEPLOY TO K8S */
//         stage('Deploy to Kubernetes') {
//             steps {
//                 container('kubectl') {
//                     sh '''
//                         kubectl apply -f k8s/deployment.yaml
//                         kubectl apply -f k8s/service.yaml

//                         kubectl rollout status deployment/ecommerce-frontend-2401077 -n ecommerce
//                         kubectl rollout status deployment/ecommerce-backend-2401077 -n ecommerce
//                     '''
//                 }
//             }
//         }
//     }
// // }
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
    args:
      - "--storage-driver=overlay2"
      - "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
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

        stage('Build Docker Images') {
            steps {
                container('dind') {
                    sh '''
                        sleep 10
                        docker build -t ecommerce-frontend:latest -f frontend/Dockerfile frontend/
                        docker build -t ecommerce-backend:latest -f backend/Dockerfile backend/
                    '''
                }
            }
        }

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

        stage('Push to Nexus') {
            steps {
                container('dind') {
                    sh '''
                        docker tag ecommerce-frontend:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/ecommerce-2401077/ecommerce-frontend:v1
                        docker tag ecommerce-backend:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/ecommerce-2401077/ecommerce-backend:v1

                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/ecommerce-2401077/ecommerce-frontend:v1
                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/ecommerce-2401077/ecommerce-backend:v1
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

                        kubectl rollout status deployment/ecommerce-backend -n 2401077 --timeout=180s
                    '''
                }
            }
        }
    }
}
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

  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    securityContext:
      runAsUser: 0
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
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json

  - name: jnlp
    image: jenkins/inbound-agent:3309.v27b_9314fd1a_4-1

  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config

  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    environment {
        NEXUS_REGISTRY = 'nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085'
        NAMESPACE = 'ecommerce-2401077'
    }

    stages {

        stage('CHECK') {
            steps {
                echo "Pipeline running. Namespace = ${NAMESPACE}"
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
                        sh '''
                            npm install
                        '''
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                container('dind') {
                    sh '''
                        sleep 10
                        docker build -t ecommerce-frontend:latest -f frontend/Dockerfile frontend/
                        docker build -t ecommerce-backend:latest -f backend/Dockerfile backend/
                    '''
                }
            }
        }

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

        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker login ${NEXUS_REGISTRY} -u student -p Imcc@2025
                    '''
                }
            }
        }

        stage('Push Images to Nexus') {
            steps {
                container('dind') {
                    sh '''
                        docker tag ecommerce-backend:latest ${NEXUS_REGISTRY}/ecommerce-2401077/ecommerce-backend:latest
                        docker tag ecommerce-frontend:latest ${NEXUS_REGISTRY}/ecommerce-2401077/ecommerce-frontend:latest

                        docker push ${NEXUS_REGISTRY}/ecommerce-2401077/ecommerce-backend:latest
                        docker push ${NEXUS_REGISTRY}/ecommerce-2401077/ecommerce-frontend:latest
                    '''
                }
            }
        }

        stage('Create Namespace + Secret') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl get namespace ${NAMESPACE} || kubectl create namespace ${NAMESPACE}

                        kubectl create secret docker-registry nexus-secret \
                          --docker-server=${NEXUS_REGISTRY} \
                          --docker-username=student \
                          --docker-password=Imcc@2025 \
                          --namespace=${NAMESPACE} \
                          --dry-run=client -o yaml | kubectl apply -f -
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

                        kubectl rollout status deployment/ecommerce-backend -n ${NAMESPACE} --timeout=180s
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
//     securityContext:
//       runAsUser: 0
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
//     volumeMounts:
//     - name: docker-config
//       mountPath: /etc/docker/daemon.json
//       subPath: daemon.json

//   - name: jnlp
//     image: jenkins/inbound-agent:3309.v27b_9314fd1a_4-1

//   volumes:
//   - name: docker-config
//     configMap:
//       name: docker-daemon-config
//   - name: kubeconfig-secret
//     secret:
//       secretName: kubeconfig-secret
// '''
//         }
//     }

//     environment {
//         NAMESPACE = 'ecommerce-2401077'
//         NEXUS_REGISTRY = 'nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository'
//     }

//     stages {

//         stage('CHECK') {
//             steps {
//                 echo "Pipeline running for namespace ${NAMESPACE}"
//             }
//         }

//         /* Build Frontend */
//         stage('Build Frontend') {
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

//         /* Build Backend */
//         stage('Build Backend') {
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

//         /* Build Docker Images */
//         stage('Build Docker Images') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         sleep 10

//                         docker build -t ecommerce__project-frontend:latest ./frontend
//                         docker build -t ecommerce__project-backend:latest ./backend
//                     '''
//                 }
//             }
//         }

//         /* SonarQube */
//         stage('SonarQube Analysis') {
//             steps {
//                 container('sonar-scanner') {
//                     sh '''
//                         sonar-scanner \
//                         -Dsonar.projectKey=ecommerce-2401077 \
//                         -Dsonar.sources=frontend,backend \
//                         -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
//                         -Dsonar.token=sqp_f3125bc1a5232a0f26c25425a4185377bfa05370
//                     '''
//                 }
//             }
//         }

//         /* Nexus Login */
//         stage('Login to Nexus Registry') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         docker login ${NEXUS_REGISTRY} -u student -p Imcc@2025
//                     '''
//                 }
//             }
//         }

//         /* Push Images to Nexus */
//         stage('Push Images to Nexus') {
//             steps {
//                 container('dind') {
//                     sh '''
//                         docker tag ecommerce__project-frontend:latest ${NEXUS_REGISTRY}/ecommerce__project-frontend:latest
//                         docker tag ecommerce__project-backend:latest ${NEXUS_REGISTRY}/ecommerce__project-backend:latest

//                         docker push ${NEXUS_REGISTRY}/ecommerce__project-frontend:latest
//                         docker push ${NEXUS_REGISTRY}/ecommerce__project-backend:latest
//                     '''
//                 }
//             }
//         }

//         /* Create Namespace + Secret */
//         stage('Create Namespace + Secrets') {
//             steps {
//                 container('kubectl') {
//                     sh '''
//                         kubectl get namespace ${NAMESPACE} || kubectl create namespace ${NAMESPACE}

//                         kubectl create secret docker-registry nexus-secret \
//                           --docker-server=${NEXUS_REGISTRY} \
//                           --docker-username=student \
//                           --docker-password=Imcc@2025 \
//                           --namespace=${NAMESPACE} \
//                           --dry-run=client -o yaml | kubectl apply -f -
//                     '''
//                 }
//             }
//         }

//         /* Deploy to Kubernetes */
//         stage('Deploy to Kubernetes') {
//             steps {
//                 container('kubectl') {
//                     sh '''
//                         kubectl apply -f k8s/deployment.yaml
//                         kubectl apply -f k8s/service.yaml

//                         kubectl rollout status deployment/ecommerce-backend -n ${NAMESPACE} --timeout=180s
//                     '''
//                 }
//             }
//         }
//     }
// }
