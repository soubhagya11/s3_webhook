pipeline {
    agent any

    environment {
        // S3 bucket name and GitHub repository URL
        S3_BUCKET = 'hjvguvujv'
        GIT_REPO = 'https://github.com/soubhagya11/s3_webhook.git'
        AWS_REGION = 'ap-south-1'
    }

    stages {
        stage('Check and Clear S3 Bucket') {
            steps {
                script {
                    echo 'Checking S3 bucket for existing objects...'
                    def objects = sh(script: "aws s3 ls s3://$S3_BUCKET --region $AWS_REGION", returnStdout: true).trim()

                    if (objects) {
                        echo 'Objects found in the S3 bucket. Deleting them...'
                        // Use the --recursive flag to delete all objects and folders inside the bucket
                        sh "aws s3 rm s3://$S3_BUCKET --recursive --region $AWS_REGION"
                        echo 'S3 bucket cleared.'
                    } else {
                        echo 'S3 bucket is already empty.'
                    }
                }
            }
        }

        stage('Git Clone Repository') {
            steps {
                script {
                    echo 'Cloning GitHub repository...'
                    // Perform the git clone operation
                    sh "git clone $GIT_REPO"
                    echo 'Repository cloned successfully.'
                }
            }
        }

        stage('Sync Code to S3 Bucket') {
            steps {
                script {
                    echo 'Syncing cloned repository\'s www folder to the S3 bucket...'
                    // Navigate into the www folder inside the cloned repository and sync to S3
                    sh "cd s3_webhook/www && aws s3 sync . s3://$S3_BUCKET --region $AWS_REGION --delete"
                    echo 'www folder content synced to S3 bucket.'
                }
            }
        }
    }
}
