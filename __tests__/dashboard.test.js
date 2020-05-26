import { default as Test, getByText } from '@testing-library/testcafe';

fixture`Getting Started`.page`https://localhost:3000/dashboard`;

test('My first test', async (t) => {
  console.log(getByText);
  const title = getByText('No Accounts');
  await t.expect(title).ok();
});
