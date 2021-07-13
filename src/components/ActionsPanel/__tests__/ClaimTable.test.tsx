import { screen, simpleRender } from 'test-utils';

import { fAccounts } from '@fixtures';
import { ClaimState, ClaimType } from '@types';
import { truncate } from '@utils';

import { ClaimTable } from '../components/ClaimTable';

function getComponent() {
  return simpleRender(<ClaimTable type={ClaimType.UNI} />, {
    initialState: {
      claims: {
        claims: {
          [ClaimType.UNI]: [
            {
              address: fAccounts[0].address,
              state: ClaimState.UNCLAIMED,
              amount: '403'
            },
            {
              address: fAccounts[2].address,
              state: ClaimState.CLAIMED,
              amount: '403'
            }
          ]
        }
      }
    }
  });
}

describe('ClaimTable', () => {
  test('render the table', async () => {
    getComponent();

    expect(screen.getByText(new RegExp(truncate(fAccounts[0].address), 'i'))).toBeDefined();
  });

  test("don't show claimed addresses", () => {
    getComponent();

    expect(screen.queryByText(new RegExp(truncate(fAccounts[2].address), 'i'))).toBeNull();
  });
});
