pipeline {
  agent {
    kubernetes {
      yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/library/node:18
    command: ["cat"]
    tty: true

  - name: sonar-scanner
    image: nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/library/sonar-scanner-cli:latest
    command: ["cat"]
    tty: true

  - name: kubectl
    image: nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/library/kubectl:latest
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
    image: nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/library/docker:dind
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
    IMAGE_NAME = "ecommerce-2401077"
    IMAGE_TAG  = "v1"
    NEXUS_REG  = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
    SONAR_URL  = "http://sonarqube.imcc.com"
    K8S_NAMESPACE = "2401077"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build Frontend') {
      steps {
        container('node') {
          dir('frontend') {
            sh '''
              npm ci
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
            sh 'npm ci'
          }
        }
      }
    }

    stage('Prepare Docker Context') {
      steps {
        sh '''
          rm -rf backend/public || true
          mkdir -p backend/public
          # Vite output usually in frontend/dist
          cp -r frontend/dist/* backend/public/ || true
          ls -la backend/public || true
        '''
      }
    }

    stage('Docker Build') {
      steps {
        container('dind') {
          sh '''
            # give docker:dind a moment
            sleep 3
            docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
          '''
        }
      }
    }

    stage('SonarQube Scan') {
      steps {
        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
          container('sonar-scanner') {
            sh """
              sonar-scanner \
                -Dsonar.projectKey=Ecommerce-Project2401077 \
                -Dsonar.sources=. \
                -Dsonar.host.url=${SONAR_URL} \
                -Dsonar.login=${SONAR_TOKEN}
            """
          }
        }
      }
    }

    stage('Login & Push to Nexus') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'nexus-creds', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
          container('dind') {
            sh '''
              docker login ${NEXUS_REG} -u ${NEXUS_USER} -p ${NEXUS_PASS}
              docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${NEXUS_REG}/${IMAGE_NAME}:${IMAGE_TAG}
              docker push ${NEXUS_REG}/${IMAGE_NAME}:${IMAGE_TAG}
            '''
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        container('kubectl') {
          sh """
            # Update image in deployment (patch) and apply manifests
            kubectl -n ${K8S_NAMESPACE} set image deployment/ecommerce-deployment ecommerce=${NEXUS_REG}/${IMAGE_NAME}:${IMAGE_TAG} --record || true
            kubectl -n ${K8S_NAMESPACE} apply -f k8s/deployment.yaml
            kubectl -n ${K8S_NAMESPACE} apply -f k8s/service.yaml
            kubectl -n ${K8S_NAMESPACE} rollout status deployment/ecommerce-deployment --timeout=120s
          """
        }
      }
    }
  }

  post {
    success { echo "Pipeline succeeded" }
    failure { echo "Pipeline failed" }
  }
}
