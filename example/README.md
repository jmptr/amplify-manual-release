# Amplify Manual Release Example

This example was created using the popular `create-react-app` package.

## Serverless

Create the AWS Amplify resources using the included `serverless.yml`.  Use `sls deploy --verbose` to see the stack outputs:

```
$ sls deploy --verbose
Serverless: Packaging service...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
CloudFormation - CREATE_IN_PROGRESS - AWS::CloudFormation::Stack - amplify-manual-release-example-dev
CloudFormation - CREATE_IN_PROGRESS - AWS::S3::Bucket - ServerlessDeploymentBucket
CloudFormation - CREATE_IN_PROGRESS - AWS::S3::Bucket - ServerlessDeploymentBucket
CloudFormation - CREATE_COMPLETE - AWS::S3::Bucket - ServerlessDeploymentBucket
CloudFormation - CREATE_IN_PROGRESS - AWS::S3::BucketPolicy - ServerlessDeploymentBucketPolicy
CloudFormation - CREATE_IN_PROGRESS - AWS::S3::BucketPolicy - ServerlessDeploymentBucketPolicy
CloudFormation - CREATE_COMPLETE - AWS::S3::BucketPolicy - ServerlessDeploymentBucketPolicy
CloudFormation - CREATE_COMPLETE - AWS::CloudFormation::Stack - amplify-manual-release-example-dev
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
CloudFormation - UPDATE_IN_PROGRESS - AWS::CloudFormation::Stack - amplify-manual-release-example-dev
CloudFormation - CREATE_IN_PROGRESS - AWS::Amplify::App - AmplifyApp
CloudFormation - CREATE_IN_PROGRESS - AWS::Amplify::App - AmplifyApp
CloudFormation - CREATE_COMPLETE - AWS::Amplify::App - AmplifyApp
CloudFormation - CREATE_IN_PROGRESS - AWS::Amplify::Branch - AmplifyBranch
CloudFormation - CREATE_IN_PROGRESS - AWS::Amplify::Branch - AmplifyBranch
CloudFormation - CREATE_COMPLETE - AWS::Amplify::Branch - AmplifyBranch
CloudFormation - UPDATE_COMPLETE_CLEANUP_IN_PROGRESS - AWS::CloudFormation::Stack - amplify-manual-release-example-dev
CloudFormation - UPDATE_COMPLETE - AWS::CloudFormation::Stack - amplify-manual-release-example-dev
Serverless: Stack update finished...
Service Information
service: amplify-manual-release-example
stage: dev
region: REGION
stack: amplify-manual-release-example-dev
resources: 4
api keys:
  None
endpoints:
  None
functions:
  None
layers:
  None

Stack Outputs
AmplifyApp: arn:aws:amplify:REGION:ACCOUNT_ID:apps/AMPLIFY_APP_ID
ServerlessDeploymentBucketName: DEPLOYMENT_BUCKET_NAME
```

## Deploying the React App

Using the value from `AMPLIFY_APP_ID` above, create a `.atgprc` file that satisfies the required arguments:

```
{
  "appId": "AMPLIFY_APP_ID",
  "branchName": "dev",
  "inputFolder": "build",
  "region": "us-east-1"
}
```

Then add a deployment script to `package.json`:

```
  "scripts": {
    "deploy": "amplify-manual-release"
  },

```

Then run the deployment script:

```
yarn deploy
```

Some example output:

```
$ yarn deploy
yarn run v1.22.10
$ amplify-manual-release
Attempt to load config from .atgprc
Found config. {
  appId: 'AMPLIFY_APP_ID',
  branchName: 'dev',
  inputFolder: 'build',
  region: 'us-east-1'
}
Creating zip archive buffer
Creating amplify deployment
Created deployment: jobId: 1
Creating http request to PUT archive in deployment URL
Starting amplify deployment
Demployment started, waiting for job to succeed
job complete
Done in 18.65s.
```