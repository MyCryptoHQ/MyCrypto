import { screen, simpleRender } from 'test-utils';

import { fAccounts } from '@fixtures';
import { translateRaw } from '@translations';
import { ClaimState, ClaimType } from '@types';

import { ClaimSubHead } from '../components/ClaimSubHead';

function getComponent() {
  return simpleRender(<ClaimSubHead type={ClaimType.UNI} />, {
    initialState: {
      claims: {
        claims: {
          [ClaimType.UNI]: [
            {
              address: fAccounts[0].address,
              state: ClaimState.UNCLAIMED,
              amount: '403'
            }
          ]
        }
      }
    }
  });
}

describe('ClaimSubHead', () => {
  test('Render the subHeading', async () => {
    getComponent();

    expect(
      screen.getByText(
        new RegExp(
          translateRaw('UNI_CLAIM_SUBHEAD', {
            $total: '1'
          }),
          'i'
        )
      )
    ).toBeDefined();
  });
});
