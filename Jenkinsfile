pipeline {
  agent {
    node {
      label 'nodetest'
    }

  }
  stages {
    stage('nodejs本地构建') {
      agent {
        node {
          label 'nodetest'
        }

      }
      steps {
        container('nodetest') {
          git(url: 'http://test.bontor.cn:30000/sxxpqp/ks-console.git', credentialsId: 'gitlab-sxxpqp', branch: '3.1', changelog: true, poll: false)
          sh 'yarn install'
          sh 'npm rebuild node-sass'
          sh 'npm run build'
          sh 'docker build -t 192.168.4.31:30002/sxxpqp/ks-console .'
          sh 'docker login $REGISTRY -u "$HARBOR_USERNAME" -p "$HARBOR_PASSWORD"'
          sh 'docker push 192.168.4.31:30002/sxxpqp/ks-console'
        }

      }
    }

    stage('k8s发布镜像') {
      agent {
        node {
          label 'base'
        }

      }
      steps {
        container('base') {
          git(url: 'http://test.bontor.cn:30000/sxxpqp/ks-console.git', credentialsId: 'gitlab-sxxpqp', branch: '3.1', changelog: true, poll: false)
          sh 'cat deploy.yaml'
          sh 'kubectl version'
          sh 'kubectl apply -f deploy.yaml'
        }

      }
    }

  }
}