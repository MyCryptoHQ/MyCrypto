import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const PROJECT_BASE = path.resolve('./');
const ORACLE_BRANCH = 'develop';
const GET_PACKAGE_CMD = `git show ${ORACLE_BRANCH}:package.json`;
const GET_DIFF_CMD = `git diff origin/${ORACLE_BRANCH}`;

const newFileRegEx = /^\+\+\+ b\//;
const frozenFolderRegEx = /\/\*$/;

const start = async () => {
  try {
    const packageStr = await runShCommand(GET_PACKAGE_CMD);
    const diff = await runShCommand(GET_DIFF_CMD);
    const { frozen } = JSON.parse(packageStr);

    if (frozen === undefined) {
      console.log(`Freezer: No config found in package.json on branch ${ORACLE_BRANCH}. Exiting.`);
      return;
    }

    const newFiles = getNewFiles(diff);
    const frozenFiles = getFrozenFiles(frozen);
    const frozenFolders = getFrozenFolders(frozen);

    ensureNewFilesAreNotFrozen(newFiles, frozenFiles, frozenFolders);
  } catch (err) {
    console.log(err.message);
    exit();
  }
};

const ensureNewFilesAreNotFrozen = (
  newFiles: string[],
  frozenFiles: string[],
  frozenFolders: string[]
): void => {
  const errors = newFiles
    .map(file => {
      if (frozenFiles.indexOf(file) !== -1) {
        return `"${file}" is frozen`;
      }
      if (isFileInFrozenFolders(file, frozenFolders)) {
        return `"${file}" is in a frozen folder`;
      }
    })
    .filter(err => err);

  if (errors.length) {
    throw new Error(`Frozen files have been modified:\n${errors.join('\n')}`);
  } else {
    console.log('Freezer: no frozen files modified.');
  }
};

const isFileInFrozenFolders = (file: string, folders: string[]): boolean =>
  folders.reduce((isFrozen, folder) => {
    if (isFrozen) {
      return isFrozen;
    }
    const folderSplit = folder.replace(frozenFolderRegEx, '').split('/');

    const fileSplit = file.split('/').slice(0, folderSplit.length);

    return JSON.stringify(folderSplit) === JSON.stringify(fileSplit);
  }, false);

const getFrozenFiles = (frozen: string[]): string[] =>
  frozen.filter(f => !frozenFolderRegEx.test(f));

const getFrozenFolders = (frozen: string[]): string[] =>
  frozen.filter(f => frozenFolderRegEx.test(f));

const getNewFiles = (diff: string): string[] =>
  diff
    .split('\n')
    .filter(line => newFileRegEx.test(line))
    .map(line => line.replace(newFileRegEx, ''));

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

const isTravisPushJob = () => {
  const prb = process.env.TRAVIS_PULL_REQUEST_BRANCH;
  return typeof prb === 'string' && prb.length === 0;
};

const exit = () => setTimeout(() => process.exit(1), 100);

// check to make sure that all of the freezer config in
// the "frozen" property of package.json is valid
const validateConfig = () => {
  try {
    const packagePath = path.resolve(PROJECT_BASE, 'package.json');
    const { frozen } = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    if (frozen === undefined) {
      console.log(`Freezer: No config found in package.json on branch ${ORACLE_BRANCH}. Exiting.`);
      return;
    }

    if (!Array.isArray(frozen)) {
      throw new Error(`Property "frozen" is not an array`);
    }

    const errors = frozen
      .map(filePath => {
        const isFolder = frozenFolderRegEx.test(filePath);
        const fullPath = isFolder
          ? path.resolve(PROJECT_BASE, filePath.replace(frozenFolderRegEx, ''))
          : path.resolve(PROJECT_BASE, filePath);

        if (!fs.existsSync(fullPath)) {
          return `"${filePath}" does not exist`;
        }

        const stats = fs.lstatSync(fullPath);

        if (isFolder) {
          if (!stats.isDirectory()) {
            return `"${filePath}" is not a folder`;
          }
        } else {
          if (!stats.isFile()) {
            return `"${filePath}" is not a file`;
          }
        }
      })
      .filter(err => err);

    if (errors.length) {
      throw new Error(errors.join('\n'));
    } else {
      console.log('Freezer: Config is valid.');
    }
  } catch (err) {
    console.log(`Freezer: Invalid config on package.json:\n${err.message}`);
    exit();
  }
};

if (isTravisPushJob()) {
  console.log('Freezer: Travis push job detected. Exiting.');
} else if (process.argv[2] === '--validate') {
  validateConfig();
} else {
  start();
}
