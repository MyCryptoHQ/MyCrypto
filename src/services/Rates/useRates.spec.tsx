import { FC } from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { actionWithPayload, mockAppState, mockUseDispatch, ProvidersWrapper } from 'test-utils';

import { fAssets, fRates, fSettings } from '@fixtures';
import { IRates } from '@types';

import useRates from './useRates';

const renderUseRates = ({ rates = {} as IRates } = {}) => {
  const wrapper: FC = ({ children }) => (
    <ProvidersWrapper initialState={mockAppState({ settings: fSettings, rates })}>
      {children}
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

  it('getAssetChange() gets correct change from settings', () => {
    const { result } = renderUseRates({ rates: fRates });
    expect(result.current.getAssetChange(fAssets[0])).toBe(fRates[fAssets[0].uuid].usd_24h_change);
  });

  it('getAssetChange() calls trackAsset on unknown assets', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseRates({ rates: fRates });

    expect(result.current.getAssetChange(fAssets[3])).toEqual(0);
    expect(mockDispatch).toHaveBeenLastCalledWith(actionWithPayload(fAssets[3]));
  });
});
