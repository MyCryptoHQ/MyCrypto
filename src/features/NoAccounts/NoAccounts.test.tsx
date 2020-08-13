import React from 'react';
import { MemoryRouter } from 'react-router';

import { simpleRender, screen, waitFor } from 'test-utils';
import { ROUTE_PATHS } from '@config';
import { StoreContext, StoreState } from '@services/Store';
import { default as NoAccounts } from './NoAccounts';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({ push: mockPush })
  };
});

const getComponent = (state: Partial<StoreState> = {}) => {
  return simpleRender(
    <MemoryRouter>
      <StoreContext.Provider value={state as StoreState}>
        <NoAccounts />
      </StoreContext.Provider>
    </MemoryRouter>
  );
};

describe('NoAccounts', () => {
  test('displays no account message', () => {
    getComponent({});
    expect(screen.getByText(/any accounts in your wallet/)).toBeInTheDocument();
  });

  test('redirects to Dashboard when StoreState has accounts', async () => {
    getComponent({ isDefault: false });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(ROUTE_PATHS.DASHBOARD.path);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });
});
