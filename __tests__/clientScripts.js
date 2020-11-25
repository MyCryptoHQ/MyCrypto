import { FIXTURE_MYC_STORAGE_KEY } from './fixtures';

// Client Script to set LS before loading the page
// Double stringified as that makes it a valid JS string
const injectLS = (ls) => `
  console.debug('TestCafe injectLS');
  localStorage.setItem(
    '${FIXTURE_MYC_STORAGE_KEY}',
    ${JSON.stringify(JSON.stringify(ls))}
  );
`;

export { injectLS };
