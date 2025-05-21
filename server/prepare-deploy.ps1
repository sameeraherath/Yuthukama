# Create deployment directory
$deployDir = "deploy"
New-Item -ItemType Directory -Force -Path $deployDir

# Copy necessary files
Copy-Item "server.js" $deployDir
Copy-Item "package.json" $deployDir
Copy-Item "package-lock.json" $deployDir
Copy-Item "Procfile" $deployDir
Copy-Item ".ebextensions" $deployDir -Recurse
Copy-Item ".platform" $deployDir -Recurse
Copy-Item "routes" $deployDir -Recurse
Copy-Item "controllers" $deployDir -Recurse
Copy-Item "models" $deployDir -Recurse
Copy-Item "middleware" $deployDir -Recurse
Copy-Item "utils" $deployDir -Recurse
Copy-Item "config" $deployDir -Recurse
Copy-Item "constants" $deployDir -Recurse

# Create zip file
Compress-Archive -Path "$deployDir\*" -DestinationPath "deploy.zip" -Force

Write-Host "Deployment package created as deploy.zip" 