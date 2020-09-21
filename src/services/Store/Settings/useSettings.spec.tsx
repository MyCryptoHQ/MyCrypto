import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import { Fiats } from '@config';
import { fAccount, fAccounts, fAssets, fLocalStorage, fRates, fSettings } from '@fixtures';
import { ISettings, LSKeys } from '@types';

import { DataContext, IDataContext } from '../DataManager';
import useSettings from './useSettings';

const renderUseAccounts = ({ settings = {} as ISettings, createActions = jest.fn() } = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <DataContext.Provider value={({ settings, createActions } as any) as IDataContext}>
      {' '}
      {children}
    </DataContext.Provider>
  );
  return renderHook(() => useSettings(), { wrapper });
};

describe('useSettings', () => {
  it('uses get settings from DataContext', () => {
    const { result } = renderUseAccounts({ settings: fSettings });
    expect(result.current.settings).toEqual(fSettings);
    expect(result.current.language).toBe(fSettings.language);
  });

  it('uses a valid data model', () => {
    const createActions = jest.fn();
    renderUseAccounts({ createActions });
    expect(createActions).toHaveBeenCalledWith(LSKeys.SETTINGS);
  });

  it('exportStorage()', () => {
    const mockExport = jest.fn().mockImplementation(() => fLocalStorage);
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ exportStorage: mockExport })),
      settings: fSettings
    });
    expect(result.current.exportStorage()).toBe(JSON.stringify(fLocalStorage));
  });

  it('importStorage()', () => {
    const mockExport = jest.fn().mockImplementation(() => fLocalStorage);
    const mockImport = jest.fn();
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ exportStorage: mockExport, importStorage: mockImport })),
      settings: fSettings
    });
    const newLS = JSON.stringify({ ...fLocalStorage, settings: fSettings });
    result.current.importStorage(newLS);
    expect(mockImport).toHaveBeenCalledWith(newLS);
  });

  it('addAccountToFavorites() should call updateAll', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ updateAll: mockUpdate })),
      settings: fSettings
    });
    result.current.addAccountToFavorites(fAccount.uuid);
    expect(mockUpdate).toHaveBeenCalledWith({
      ...fSettings,
      dashboardAccounts: [...fSettings.dashboardAccounts, fAccount.uuid]
    });
  });

  it('addMultipleAccountsToFavorites() should call updateAll', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ updateAll: mockUpdate })),
      settings: fSettings
    });
    const uuids = fAccounts.map((a) => a.uuid);
    result.current.addMultipleAccountsToFavorites(uuids);
    expect(mockUpdate).toHaveBeenCalledWith({
      ...fSettings,
      dashboardAccounts: [...fSettings.dashboardAccounts, ...uuids]
    });
  });

  it('addAssetToExclusionList() should call updateAll', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ updateAll: mockUpdate })),
      settings: fSettings
    });
    result.current.addAssetToExclusionList(fAssets[0].uuid);
    expect(mockUpdate).toHaveBeenCalledWith({
      ...fSettings,
      excludedAssets: [...fSettings.excludedAssets, fAssets[0].uuid]
    });
  });

  it('removeAssetfromExclusionList() should call updateAll', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ updateAll: mockUpdate })),
      settings: fSettings
    });
    result.current.removeAssetfromExclusionList(fSettings.excludedAssets[0]);
    expect(mockUpdate).toHaveBeenCalledWith({
      ...fSettings,
      excludedAssets: []
    });
  });

  it('updateSettingsAccounts() should call updateAll', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ updateAll: mockUpdate })),
      settings: fSettings
    });
    const uuids = fAccounts.map((a) => a.uuid);
    result.current.updateSettingsAccounts(uuids);
    expect(mockUpdate).toHaveBeenCalledWith({
      ...fSettings,
      dashboardAccounts: uuids
    });
  });

  it('updateSettingsNode() should call updateAll', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ updateAll: mockUpdate })),
      settings: fSettings
    });
    const node = 'mynode';
    result.current.updateSettingsNode(node);
    expect(mockUpdate).toHaveBeenCalledWith({
      ...fSettings,
      node
    });
  });

  it('updateSettingsRates() should call updateAll', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ updateAll: mockUpdate })),
      settings: fSettings
    });
    result.current.updateSettingsRates(fRates);
    expect(mockUpdate).toHaveBeenCalledWith({
      ...fSettings,
      rates: fRates
    });
  });

  it('updateLanguageSelection() should call updateAll', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ updateAll: mockUpdate })),
      settings: fSettings
    });
    const language = 'da';
    result.current.updateLanguageSelection(language);
    expect(mockUpdate).toHaveBeenCalledWith({
      ...fSettings,
      language
    });
  });

  it('updateFiatCurrency() should call updateAll', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ updateAll: mockUpdate })),
      settings: fSettings
    });
    const fiat = Fiats.EUR.ticker;
    result.current.updateFiatCurrency(fiat);
    expect(mockUpdate).toHaveBeenCalledWith({
      ...fSettings,
      fiatCurrency: fiat
    });
  });

  it('isValidImport() succeeds under normal circumstances', () => {
    const mockExport = jest.fn().mockImplementation(() => fLocalStorage);
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ exportStorage: mockExport })),
      settings: fSettings
    });
    const isValid = result.current.isValidImport(JSON.stringify(fLocalStorage));
    expect(isValid).toBe(true);
  });

  it('isValidImport() fails with mismatching versions', () => {
    const mockExport = jest.fn().mockImplementation(() => fLocalStorage);
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ exportStorage: mockExport })),
      settings: fSettings
    });
    const isValid = result.current.isValidImport(
      JSON.stringify({ ...fLocalStorage, version: '0' })
    );
    expect(isValid).toBe(false);
  });

  it('isValidImport() fails with missing keys', () => {
    const { accounts, ...lsWithoutAccounts } = fLocalStorage;
    const mockExport = jest.fn().mockImplementation(() => lsWithoutAccounts);
    const { result } = renderUseAccounts({
      createActions: jest.fn(() => ({ exportStorage: mockExport })),
      settings: fSettings
    });
    const isValid = result.current.isValidImport(JSON.stringify(fLocalStorage));
    expect(isValid).toBe(false);
  });
});
