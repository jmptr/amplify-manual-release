import * as aws from 'aws-sdk';
import axios from 'axios';
import AdmZip from 'adm-zip';

export type ManualReleaseOptions = {
  appId: string;
  branchName: string;
  region: string;
  inputFolder: string;
};

export function createAmplifyDeployment(options: ManualReleaseOptions) {
  const { appId, branchName, inputFolder, region } = options;

  // set the region
  const amplify = new aws.Amplify({ region });

  // minimum deployment props: appId and branchName
  const deploymentProps = {
    appId,
    branchName,
  };

  // create the zip archive buffer to send to amplify
  console.log(`Creating zip archive buffer`);

  const zip = new AdmZip();
  zip.addLocalFolder(inputFolder);
  const archiveBuffer = zip.toBuffer();

  console.log('Creating amplify deployment');
  // job id is created by createDeployment, but is used in start and stop operations.
  let currentJobId = '';

  return amplify
    .createDeployment(deploymentProps)
    .promise()
    .then((amplifyDeployment) => {
      const { jobId, zipUploadUrl } = amplifyDeployment;
      currentJobId = jobId || '';
      console.log(`Created deployment: jobId: ${jobId}`);
      console.log(`Creating http request to PUT archive in deployment URL`);
      return axios.put(zipUploadUrl, archiveBuffer);
    })
    .then(() => {
      console.log('Starting amplify deployment');
      return amplify
        .startDeployment({ ...deploymentProps, jobId: currentJobId })
        .promise();
    })
    .then(() => {
      console.log('Demployment started, waiting for job to succeed');
      return waitJobToSucceed(
        { ...deploymentProps, jobId: currentJobId },
        amplify
      );
    })
    .catch((err) => {
      console.log('ERROR', err);
      console.log('ERROR', `Cleaning up jobId: ${currentJobId}`);
      if (currentJobId) {
        amplify.stopJob({ ...deploymentProps, jobId: currentJobId }).promise();
      }
    })
    .finally(() => {
      console.log('job complete');
      currentJobId = '';
    });
}

function sleep(ms: number) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(resolve, ms);
    } catch (err) {
      reject(err);
    }
  });
}

function waitJobToSucceed(
  job: aws.Amplify.GetJobRequest,
  amplifyClient: aws.Amplify
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      console.log('Job Timeout before succeeded');
      reject();
    }, 1000 * 60 * 10);

    let processing = true;

    try {
      while (processing) {
        const getJobResult = await amplifyClient.getJob(job).promise();
        const jobSummary = getJobResult.job.summary;
        if (jobSummary.status === 'FAILED') {
          console.log(`Job failed.${JSON.stringify(jobSummary)}`);
          clearTimeout(timeout);
          processing = false;
          resolve();
        }
        if (jobSummary.status === 'SUCCEED') {
          clearTimeout(timeout);
          processing = false;
          resolve();
        }
        await sleep(1000 * 3);
      }
    } catch (err) {
      processing = false;
      reject(err);
    }
  });
}
