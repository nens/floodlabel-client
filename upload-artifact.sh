#!/bin/bash
set -e
set -u

# ARTIFACTS_KEY_STAGING and ARTIFACTS_KEY_PRODUCTION are set as env variables
# in the travis UI.
# TRAVIS_BRANCH is set automatically by travis
ARTIFACT=floodlabel-client.zip

if [ $1 = "production" ]
then
    PROJECT=floodlabel-client-production
    ARTIFACTS_KEY=${ARTIFACTS_KEY_PRODUCTION}
fi

if [ $1 = "staging" ]
then
    PROJECT=floodlabel-client-staging
    ARTIFACTS_KEY=${ARTIFACTS_KEY_STAGING}
fi

curl -X POST \
     --retry 3 \
     -H "Content-Type: multipart/form-data" \
     -F key=${ARTIFACTS_KEY} \
     -F artifact=@${ARTIFACT} \
     -F branch=${TRAVIS_BRANCH} \
     https://artifacts.lizard.net/upload/${PROJECT}/
