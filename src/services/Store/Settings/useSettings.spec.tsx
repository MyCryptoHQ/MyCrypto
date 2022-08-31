import { FC } from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { actionWithPayload, mockAppState, mockUseDispatch, ProvidersWrapper } from 'test-utils';

import { Fiats } from '@config';
import { fAccounts, fAssets, fRates, fSettings } from '@fixtures';
import { ISettings } from '@types';

import useSettings from './useSettings';

const renderUseSettings = ({ settings = {} as ISettings } = {}) => {
  const wrapper: FC = ({ children }) => (
    <ProvidersWrapper initialState={mockAppState({ settings })}>{children}</ProvidersWrapper>
  );
  return renderHook(() => useSettings(), { wrapper });
};

describe('useSettings', () => {
  it('uses get settings from store', () => {
    const { result } = renderUseSettings({ settings: fSettings });
    expect(result.current.settings).toEqual(fSettings);
    expect(result.current.language).toBe(fSettings.language);
  });

  it('addAssetToExclusionList() should call updateAll', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseSettings({ settings: fSettings });
    result.current.addAssetToExclusionList(fAssets[0].uuid);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fAssets[0].uuid));
  });

  it('removeAssetfromExclusionList() should call updateAll', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseSettings({ settings: fSettings });
    result.current.removeAssetfromExclusionList(fSettings.excludedAssets[0]);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fSettings.excludedAssets[0]));
  });

  it('updateSettingsAccounts() should call updateAll', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseSettings({ settings: fSettings });
    const uuids = fAccounts.map((a) => a.uuid);
    result.current.updateSettingsAccounts(uuids);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(uuids));
  });

  it('updateSettingsRates() should call updateAll', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseSettings({ settings: fSettings });
    result.current.updateSettingsRates(fRates);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fRates));
  });

  it('updateLanguageSelection() should call updateAll', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseSettings({ settings: fSettings });
    const language = 'da';
    result.current.updateLanguageSelection(language);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(language));
  });

  it('updateFiatCurrency() should call updateAll', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseSettings({ settings: fSettings });
    const fiat = Fiats.EUR.ticker;
    result.current.updateFiatCurrency(fiat);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fiat));
  });
});
