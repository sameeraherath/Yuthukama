# Ensure we're in the server directory
Set-Location $PSScriptRoot

# Deploy to Elastic Beanstalk
Write-Host "Deploying to Elastic Beanstalk..."
eb deploy

Write-Host "Deployment complete!" 