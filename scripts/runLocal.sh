#!/usr/bin/env bash

# Stop immediately on error
set -e

if [[ -z "$1" ]]; then
  $(./scripts/assumeDeveloperRole.sh)
fi

# Only install production modules
export NODE_ENV=production

# Build the project
SAM_TEMPLATE=template.yaml
sam build --template ${SAM_TEMPLATE}

# Start the API locally
export API_URL='https://choosee-api.bowland.link/v1'
export CORS_DOMAIN='http://choosee.bowland.link'
export DYNAMODB_TABLE_NAME=choosee-api-test
export GOOGLE_API_KEY=$(aws ssm get-parameter --name google-places-api | jq -r .Parameter.Value)
export ID_MIN_LENGTH=3
export ID_MAX_LENGTH=4
export SMS_API_KEY=$(aws apigateway get-api-key --api-key l3q9ffyih6 --include-value --region us-east-1 | jq -r .value)
export SMS_API_URL='https://sms-queue-api.bowland.link/v1'
export USER_POOL_ID=us-east-2_7k2VH6sSy
sam local start-api --region=us-east-2 --force-image-build  --parameter-overrides "Environment=test GoogleApiKey=$GOOGLE_API_KEY SmsApiKey=$SMS_API_KEY"
