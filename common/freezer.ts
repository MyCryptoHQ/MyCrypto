import { spawn } from 'child_process';
import * as path from 'path';

const GET_PACKAGE_CMD = 'git show develop:package.json';
const GET_DIFF_CMD = 'git diff origin/develop';

const start = async () => {
  try {
    const packageJson = await runShCommand(GET_PACKAGE_CMD);
    const diff = await runShCommand(GET_DIFF_CMD);

    console.log(packageJson);
    console.log(diff);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const runShCommand = (cmd: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const sh = spawn('sh', ['-c', cmd]);
    const stdout: string[] = [];
    const stderr: string[] = [];

    sh.stdout.on('data', data => {
      stdout.push(data.toString());
    });
    sh.stderr.on('data', data => {
      stderr.push(data.toString());
    });
    sh.on('close', code => {
      if (code !== 0) {
        console.error(stderr.join(''));
        reject(`Child process closed with code ${code}`);
      }
      resolve(stdout.join(''));
    });
  });

start();
