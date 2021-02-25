import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { actionWithPayload, mockUseDispatch, ProvidersWrapper } from 'test-utils';

import { fAssets, fRates, fSettings } from '@fixtures';
import { DataContext, IDataContext } from '@services';
import { StoreContext } from '@services/Store';
import { State } from '@services/Store/StoreProvider';
import { IRates } from '@types';

import useRates from './useRates';

const renderUseRates = ({ rates = {} as IRates } = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <ProvidersWrapper>
      <DataContext.Provider
        value={({ settings: fSettings, rates: rates } as unknown) as IDataContext}
      >
        <StoreContext.Provider value={({ trackedAssets: [] } as unknown) as State}>
          {' '}
          {children}
        </StoreContext.Provider>
      </DataContext.Provider>
    </ProvidersWrapper>
  );
  return renderHook(() => useRates(), { wrapper });
};

describe('useRates', () => {
  it('getAssetRate() gets correct rate from settings', () => {
    const { result } = renderUseRates({ rates: fRates });
    expect(result.current.getAssetRate(fAssets[0])).toBe(fRates[fAssets[0].uuid].usd);
  });

  it('getAssetRate() calls trackAsset on unknown assets', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseRates({ rates: fRates });
    expect(result.current.getAssetRate(fAssets[3])).toBe(0);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fAssets[3].uuid));
  });

  it('getAssetRateInCurrency() gets correct rate from settings', () => {
    const { result } = renderUseRates({ rates: fRates });
    expect(result.current.getAssetRateInCurrency(fAssets[0], 'EUR')).toBe(
      fRates[fAssets[0].uuid].eur
    );
  });

  it('getAssetRateInCurrency() calls trackAsset on unknown assets', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseRates({ rates: fRates });
    expect(result.current.getAssetRateInCurrency(fAssets[3], 'EUR')).toBe(0);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fAssets[3].uuid));
  });
});
