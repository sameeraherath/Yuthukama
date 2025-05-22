#!/bin/bash
set -e

# Install dependencies
cd /var/app/staging
npm install --production

# Ensure proper permissions
chmod +x /var/app/staging/server.js 