import * as fs from 'fs';
import * as path from 'path';

export function config(configFilePath: string) {
  const configFullPath = path.join(process.cwd(), configFilePath);
  console.log(`Attempt to load config from ${configFullPath}`);

  if (!fs.existsSync(configFullPath)) {
    console.log('Config file path does not exist.')
    return {};
  }
  try {
    const result = JSON.parse(fs.readFileSync(configFullPath) as any);
    console.log('Found config.', result);
    return result;
  } catch (e) {
    console.log('Error', e.message);
    return {};
  }
};
