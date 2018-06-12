import packageJSON from '../package.json';

interface Dependencies {
  [key: string]: string;
}

// from https://docs.npmjs.com/files/package.json#dependencies
const nonExactPrefixes = ['~', '^', '>', '>=', '<', '<='];

describe('package.json', () => {
  it('dependencies should not contain any non-exact versions', () => {
    const deps = Object.values(packageJSON.dependencies as Dependencies);
    deps.forEach(depVersion => {
      nonExactPrefixes.forEach(badPrefix => {
        expect(depVersion.includes(badPrefix)).toBeFalsy();
      });
    });
  });
  it('devDependencies should not contain any non-exact versions', () => {
    const deps = Object.values(packageJSON.devDependencies as Dependencies);
    deps.forEach(depVersion => {
      nonExactPrefixes.forEach(badPrefix => {
        expect(depVersion.includes(badPrefix)).toBeFalsy();
      });
    });
  });
});
