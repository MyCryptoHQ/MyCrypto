import { Selector } from 'testcafe';
import { waitForReact, ReactSelector } from 'testcafe-react-selectors';

fixture`Getting Started`.page`https://localhost:3000/dashboard`.beforeEach(async () => {
  await waitForReact(5000);
});

test('My first test', async (t) => {
  // await t.expect(await Selector('h2').innerText).eql('Hello');
  const header = ReactSelector('NoAccounts').find('Header');
  await t.expect(header.innerText).eql('Hello');
});
