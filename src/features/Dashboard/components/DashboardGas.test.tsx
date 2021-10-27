import { mockStore, simpleRender } from 'test-utils';

import { fAssets, fSettings } from '@fixtures';
import { bigify } from '@utils';

import { DashboardGas } from './DashboardGas';

describe('DashboardGas', () => {
  const renderComponent = () => {
    return simpleRender(<DashboardGas />, {
      initialState: mockStore({
        dataStoreState: {
          assets: fAssets,
          settings: fSettings,
          rates: {
            '356a192b-7913-504c-9457-4d18c28d46e6': {
              usd: 4000
            }
          }
        },
        storeSlice: {
          gas: {
            baseFee: bigify('200000000000')
          }
        }
      })
    });
  };

  it('Can render', () => {
    const { getByText } = renderComponent();
    expect(getByText('200 Gwei')).toBeInTheDocument();
    expect(getByText('$17')).toBeInTheDocument();
  });
});
