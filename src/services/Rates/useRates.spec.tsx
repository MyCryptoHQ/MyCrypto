import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { actionWithPayload, mockUseDispatch, ProvidersWrapper } from 'test-utils';

import { fAssets, fRates, fSettings } from '@fixtures';
import { DataContext, IDataContext } from '@services';
import { IRates } from '@types';

import useRates from './useRates';

const renderUseRates = ({ rates = {} as IRates } = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <ProvidersWrapper>
      <DataContext.Provider
        value={
          ({ settings: fSettings, rates: rates, trackedAssets: {} } as unknown) as IDataContext
        }
      >
        {children}
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

    expect(result.current.getAssetRate(fAssets[3])).toEqual(0);
    expect(mockDispatch).toHaveBeenLastCalledWith(actionWithPayload(fAssets[3]));
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

    expect(result.current.getAssetRateInCurrency(fAssets[3], 'EUR')).toEqual(0);
    expect(mockDispatch).toHaveBeenLastCalledWith(actionWithPayload(fAssets[3]));
  });
});
