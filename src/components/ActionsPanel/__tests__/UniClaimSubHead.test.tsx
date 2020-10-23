import React from 'react';

import { screen, simpleRender } from 'test-utils';

import { fAccounts } from '@fixtures';
import { StoreContext } from '@services';
import { ClaimState } from '@services/ApiService/Uniswap/Uniswap';
import { translateRaw } from '@translations';

import { UniClaimSubHead } from '../components/UniClaimSubHead';

function getComponent() {
  return simpleRender(
    <StoreContext.Provider
      value={
        ({
          uniClaims: [
            {
              address: fAccounts[0].address,
              state: ClaimState.UNCLAIMED,
              amount: '403'
            }
          ]
        } as any) as any
      }
    >
      <UniClaimSubHead />
    </StoreContext.Provider>
  );
}

describe('UniClaimSubHead', () => {
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
