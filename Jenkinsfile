pipeline {
    agent any

    // Triggers the pipeline automatically
    triggers {
        // Option 1: Poll SCM every minute (useful if webhooks aren't supported)
        // pollSCM('* * * * *')
        
        // Option 2: Listen for Git webhooks (Requires Jenkins webhook plugin configured)
        githubPush() 
    }

    // Requirements:
    // 1. NodeJS Plugin installed in Jenkins
    // 2. A NodeJS installation configured in Global Tool Configuration (named 'NodeJS 20' for example)
    tools {
        nodejs 'NodeJS 20' 
    }

    environment {
        // Environment variables required for the build / tests
        DATABASE_URL = "file:./dev.db"
        // VERY IMPORTANT: Do not hardcode real secrets here in production.
        // Use Jenkins Credentials instead: credentials('AUTH_SECRET_ID')
        AUTH_SECRET = "placeholder-auth-secret" 
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout code from source control (Git)
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Note: Use 'bat' instead of 'sh' if your Jenkins worker node is running on Windows.
                sh 'npm install' 
                // Alternatively, 'npm ci' is preferred in CI environments if you commit package-lock.json
            }
        }

        stage('Prisma Generate') {
            steps {
                // Generate the Prisma Client required for database operations
                sh 'npx prisma generate'
            }
        }

        stage('Lint') {
            steps {
                // Run Next.js ESLint checks
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                // Run tests and collect coverage
                sh 'npm run test:coverage'
            }
        }

        stage('Build') {
            steps {
                // Compile the Next.js production bundle
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            // Only trigger deployment on the main branch
            when {
                branch 'main'
            }
            steps {
                // Placeholder for your deployment logic.
                // E.g., docker build, PM2 restart, Vercel deployment, rsync to a server, etc.
                echo 'Application successfully built. Deploying via Jenkins...'
                
                // Example for PM2 (if running on a VPS):
                // sh 'pm2 start npm --name "pulse-app" -- start'
            }
        }
    }

    post {
        always {
            // Clean up workspace or notify status
            echo 'Pipeline has completed.'
        }
        success {
            echo '✅ Build successful! The Pulse Next.js application is ready.'
        }
        failure {
            echo '❌ Build failed. Please check the stage logs.'
        }
    }
}
