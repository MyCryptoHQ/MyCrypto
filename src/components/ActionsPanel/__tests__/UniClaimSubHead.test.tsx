import React from 'react';

import { screen, simpleRender } from 'test-utils';

import { fAccounts } from '@fixtures';
import { translateRaw } from '@translations';
import { ClaimState } from '@types';

import { UniClaimSubHead } from '../components/UniClaimSubHead';

function getComponent() {
  return simpleRender(<UniClaimSubHead />, {
    initialState: {
      claims: {
        uniClaims: [
          {
            address: fAccounts[0].address,
            state: ClaimState.UNCLAIMED,
            amount: '403'
          }
        ]
      }
    }
  });
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
