import { fireEvent, mockAppState, simpleRender, waitFor } from 'test-utils';

import { fAccounts, fSettings } from '@fixtures';
import { PoapClaimService } from '@services/ApiService/PoapClaim';
import { translateRaw } from '@translations';
import { TURL } from '@types';

import { WinterNotification } from './WinterNotification';

jest.mock('@services/ApiService/PoapClaim', () => ({
  PoapClaimService: {
    claim: jest.fn()
  }
}));

function getComponent(claimed = false) {
  return simpleRender(<WinterNotification />, {
    initialState: mockAppState({
      accounts: fAccounts,
      settings: { ...fSettings, analyticsUserID: 'foo' },
      promoPoaps: {
        promos: {
          winter2021: {
            key: 'winter2021',
            claimed,
            claim: 'foo'
          }
        }
      }
    })
  });
}

describe('WinterNotification', () => {
  it('renders default state', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('POAP_NOTIFICATION_HEADER'))).toBeDefined();
    expect(getByText(translateRaw('CLAIM_NOW'))).toBeDefined();
  });

  it('can claim', async () => {
    const { getByText } = getComponent();
    (PoapClaimService.claim as jest.MockedFunction<
      typeof PoapClaimService.claim
    >).mockResolvedValueOnce({ success: true, claim: 'foo' as TURL });
    expect(getByText(translateRaw('POAP_NOTIFICATION_HEADER'))).toBeDefined();
    const button = getByText(translateRaw('CLAIM_NOW'));
    fireEvent.click(button);
    await waitFor(() => expect(PoapClaimService.claim).toHaveBeenCalled());
  });

  it('can enter error state', async () => {
    const { getByText } = getComponent();
    (PoapClaimService.claim as jest.MockedFunction<
      typeof PoapClaimService.claim
    >).mockResolvedValueOnce({ success: false, msg: 'error' });
    expect(getByText(translateRaw('POAP_NOTIFICATION_HEADER'))).toBeDefined();
    const button = getByText(translateRaw('CLAIM_NOW'));
    fireEvent.click(button);
    await waitFor(() => expect(PoapClaimService.claim).toHaveBeenCalled());
    await waitFor(() => expect(getByText(translateRaw('POAP_ERROR_HEADER'))).toBeDefined());
  });

  it('renders claimed state', async () => {
    const { getByText } = getComponent(true);
    expect(getByText(translateRaw('POAP_NOTIFICATION_HEADER'))).toBeDefined();
    expect(getByText(translateRaw('POAP_CLAIM_APPROVED'))).toBeDefined();
  });
});
