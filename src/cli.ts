#!/usr/bin/env node

import yargs from 'yargs';
import {
  createAmplifyDeployment,
  ManualReleaseOptions,
} from './amplify-manual-release';
import { config } from './configuration';

const argv = yargs
  .scriptName('amplify-manual-release')
  .version('1.0.0')
  .usage(
    'Usage: $0 --app-id str --branch-name str --region str --input-folder str'
  )
  .example(
    '$0 --app-id 1234 --branch-name prod --region us-east-1 --input-folder dist',
    `Creates an archive from the input folder, then creates an amplify deployment. Informs when the deployment succeeds for fails.`
  )
  .option('appId', {
    describe: 'The amplify app id',
    demandOption: 'AppId is required',
    type: 'string',
  })
  .option('branchName', {
    describe: 'The branch name for the deployment',
    demandOption: 'Branch name is required',
    type: 'string',
  })
  .option('region', {
    describe: 'The AWS region where the amplify app exists.',
    demandOption: 'Region is required',
    type: 'string',
  })
  .option('inputFolder', {
    describe: 'The path to the deployment artifacts.',
    demandOption: 'Input folder is required',
    type: 'string',
  })
  .config(config('.atgprc')).argv;

const options: ManualReleaseOptions = {
  appId: argv.appId,
  branchName: argv.branchName,
  region: argv.region,
  inputFolder: argv.inputFolder,
};

createAmplifyDeployment(options);
