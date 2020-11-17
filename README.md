# Amplify Manual Release

My favorite part of AWS Amplify is the hosting part. It's just great!

What I _don't_ like is how the AWS Amplify Console wants to get involved with my continuous integration workflow. Since I use gitlab for some projects, I can't always use the git integrations that come with the AWS Amplify Console.

To solve this, I wrote `amplify-manual-release` to make manual deployments to AWS Amplify super simple.

## Installation

The `aws-sdk` package is a peed dependency, so install that along with this package:

`npm install --save-dev aws-sdk amplify-manual-release`

or

`yarn add -D aws-sdk amplify-manual-release`

## Configuration

`amplify-manual-release` can be configured via a `.atgprc` file or via command line.

```
Usage: amplify-manual-release --app-id str --branch-name str --region str
--input-folder str
Options:
  --help         Show help                                             [boolean]
  --version      Show version number                                   [boolean]
  --appId        The amplify app id                          [string] [required]
  --branchName   The branch name for the deployment          [string] [required]
  --region       The AWS region where the amplify app exists.[string] [required]
  --inputFolder  The path to the deployment artifacts.       [string] [required]
Examples:
  amplify-manual-release --app-id 1234      Creates an archive from the input
  --branch-name prod --region us-east-1     folder, then creates an amplify
  --input-folder dist                       deployment. Informs when the
                                            deployment succeeds for fails.
```

### `.atgprc` Configuration

```
{
  "appId": "12345",
  "branchName": "prod",
  "region": "us-east-1",
  "inputFolder": "dist"
}
```

## Usage

In package.json:

```
  "scripts": {
    "deploy": "amplify-manual-release"
  },
```

## With `serverless`

Using `serverless`, you can now create the resources for an AWS Amplify app:

```
resources:
  Resources:
    AmplifyApp:
      Type: AWS::Amplify::App
      Properties:
        Name: AmplifyAppName

    AmplifyBranch:
      Type: AWS::Amplify::Branch
      Properties:
        AppId: !GetAtt AmplifyApp.AppId
        BranchName: prod
        EnableAutoBuild: false
```