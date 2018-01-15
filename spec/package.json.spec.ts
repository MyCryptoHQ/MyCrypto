import packageJSON from '../package.json';

// from https://docs.npmjs.com/files/package.json#dependencies
const nonExactPrefixes = ['~', '^', '>', '>=', '<', '<='];

describe('package.json', () => {
  it('dependencies should not contain any non-exact versions', () => {
    const deps = Object.values(packageJSON.dependencies);
    deps.forEach(depVersion => {
      nonExactPrefixes.forEach(badPrefix => {
        expect(depVersion.includes(badPrefix)).toBeFalsy();
      });
    });
  });
  it('devDependencies should not contain any non-exact versions', () => {
    const deps = Object.values(packageJSON.devDependencies);
    deps.forEach(depVersion => {
      nonExactPrefixes.forEach(badPrefix => {
        expect(depVersion.includes(badPrefix)).toBeFalsy();
      });
    });
  });
});
