pipeline {
    agent any
    
    parameters {
        string(name: 'GIT_REPO', defaultValue: 'https://github.com/TheLalitSharma/pw-ts-web-api.git', description: 'Git Repository URL')
        string(name: 'GIT_BRANCH', defaultValue: 'tempci', description: 'Git Branch to checkout')
        choice(name: 'ENVIRONMENT', choices: ['dev', 'qa', 'staging', 'prod'], description: 'Target Environment')
    }
    
    environment {
        WORKSPACE_DIR = "${WORKSPACE}"
        REPORTS_DIR = "playwright-report"
        ALLURE_RESULTS = "allure-results"
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${env.PATH}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Starting Playwright Test Execution Pipeline"
                    echo "Repository: ${params.GIT_REPO}"
                    echo "Branch: ${params.GIT_BRANCH}"
                    echo "Environment: ${params.ENVIRONMENT}"
                }
            }
        }
        
        stage('Execute Tests') {
            steps {
                script {
                    sh """
                        chmod +x ${WORKSPACE}/executor.sh
                        ${WORKSPACE}/executor.sh ${params.GIT_REPO} ${params.GIT_BRANCH} ${params.ENVIRONMENT}
                    """
                }
            }
        }
        
        stage('Archive Reports') {
            steps {
                script {
                    // Archive HTML reports
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: "${REPORTS_DIR}",
                        reportFiles: 'index.html',
                        reportName: 'Playwright Test Report',
                        reportTitles: "Playwright Report - ${params.ENVIRONMENT}"
                    ])
                    
                    // Archive test artifacts
                    archiveArtifacts artifacts: "${REPORTS_DIR}/**/*", allowEmptyArchive: true
                    archiveArtifacts artifacts: "test-results/**/*", allowEmptyArchive: true
                    
                    // Optional: Allure Report
                    // allure includeProperties: false, jdk: '', results: [[path: "${ALLURE_RESULTS}"]]
                }
            }
        }
        
        stage('Publish Test Results') {
            steps {
                script {
                    // JUnit test results
                    junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo "Pipeline execution completed"
                // Cleanup workspace if needed
                // cleanWs()
            }
        }
        success {
            echo "Tests executed successfully on ${params.ENVIRONMENT} environment"
        }
        failure {
            echo "Test execution failed. Check logs for details."
        }
    }
}