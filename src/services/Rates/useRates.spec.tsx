import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { IRates, TUuid } from '@types';

import { DataContext, IDataContext, RatesContext, SettingsContext } from '@services';
import { fSettings, fAssets, fDefiReserveRates } from '@fixtures';
import useRates from './useRates';
import { ReserveMapping } from './RatesProvider';

const renderUseRates = ({
  rates = {} as IRates,
  reserveRateMapping = {} as ReserveMapping,
  trackAsset = jest.fn()
} = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <DataContext.Provider value={({ createActions: jest.fn() } as any) as IDataContext}>
      <SettingsContext.Provider value={{ settings: fSettings } as any}>
        <RatesContext.Provider value={{ rates, reserveRateMapping, trackAsset } as any}>
          {' '}
          {children}
        </RatesContext.Provider>
      </SettingsContext.Provider>
    </DataContext.Provider>
  );
  return renderHook(() => useRates(), { wrapper });
};

describe('useRates', () => {
  it('getAssetRate() gets correct rate from settings', () => {
    const { result } = renderUseRates({ rates: fSettings.rates });
    expect(result.current.getAssetRate(fAssets[2])).toBe(195.04);
  });

  it('getAssetRate() calls trackAsset on unknown assets', () => {
    const mockTrackAsset = jest.fn();
    const { result } = renderUseRates({ rates: {}, trackAsset: mockTrackAsset });
    expect(result.current.getAssetRate(fAssets[0])).toBe(0);
    expect(mockTrackAsset).toBeCalledWith(fAssets[0].uuid);
  });

  it('getAssetRateInCurrency() gets correct rate from settings', () => {
    const { result } = renderUseRates({ rates: fSettings.rates });
    expect(result.current.getAssetRateInCurrency(fAssets[2], 'EUR')).toBe(179.88);
  });

  it('getAssetRateInCurrency() calls trackAsset on unknown assets', () => {
    const mockTrackAsset = jest.fn();
    const { result } = renderUseRates({ rates: {}, trackAsset: mockTrackAsset });
    expect(result.current.getAssetRateInCurrency(fAssets[0], 'EUR')).toBe(0);
    expect(mockTrackAsset).toBeCalledWith(fAssets[0].uuid);
  });

  it('getPoolAssetReserveRate() returns asset with reserveExchangeRate', () => {
    const { result } = renderUseRates({
      rates: {},
      reserveRateMapping: fDefiReserveRates
    });
    expect(
      result.current.getPoolAssetReserveRate('0039e50a-bab5-52fc-a48f-43f36410a87a' as TUuid, [
        fAssets[0]
      ])
    ).toStrictEqual([{ ...fAssets[0], reserveExchangeRate: '2.368285030204416' }]);
  });
});
