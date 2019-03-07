import packageJSON from '../package.json';

interface Dependencies {
  [key: string]: string;
}

// from https://docs.npmjs.com/files/package.json#dependencies
const nonExactPrefixes = /^(~|\^|>|>=|<|<=)/;

describe('package.json', () => {
  it.each(['dependencies', 'devDependencies'])(
    '%s should not contain any non-exact versions',
    property => {
      const deps = Object.values(packageJSON[property] as Dependencies);
      deps.forEach(depVersion => {
        expect(depVersion).not.toMatch(nonExactPrefixes);
      });
    }
  );
});
