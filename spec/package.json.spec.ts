import packageJSON from '../package.json';

interface Dependencies {
  [key: string]: string;
}

const dependencies = Object.entries({
  ...(packageJSON.dependencies as Dependencies),
  ...(packageJSON.devDependencies as Dependencies)
});

// from https://docs.npmjs.com/files/package.json#dependencies
const nonExactPrefixes = /^(~|\^|>|>=|<|<=)/;

describe('package.json', () => {
  it.each(dependencies)('%s should have an exact version', (dep, depVersion) => {
    expect(depVersion).not.toMatch(nonExactPrefixes);
  });
});
