import React from 'react';

import { Provider } from 'react-redux';
import { actionWithPayload, getUseDispatchMock, renderHook } from 'test-utils';

import { fAccount, fAccounts, fAssets, fRates, fSettings } from '@fixtures';
import { store } from '@store';
import { ISettings } from '@types';

import { DataContext, IDataContext } from '../DataManager';
import useSettings from './useSettings';

const renderUseAccounts = ({ settings = {} as ISettings } = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <DataContext.Provider value={({ settings } as any) as IDataContext}>
        {children}
      </DataContext.Provider>
    </Provider>
  );
  return renderHook(() => useSettings(), { wrapper });
};

describe('useSettings', () => {
  it('uses get settings from DataContext', () => {
    const { result } = renderUseAccounts({ settings: fSettings });
    expect(result.current.settings).toEqual(fSettings);
    expect(result.current.language).toBe(fSettings.language);
  });

  it('addFavoriteAccount() dispatchs an update action', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseAccounts({ settings: fSettings });
    result.current.addFavoriteAccount(fAccount.uuid);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fAccount.uuid));
  });

  it('addFavoriteAccounts() dispatchs an updateMany action', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseAccounts({ settings: fSettings });
    const uuids = fAccounts.map((a) => a.uuid);
    result.current.addFavoriteAccounts(uuids);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload([...uuids]));
  });

  it('addExcludedAsset() dispatchs an update action', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseAccounts({ settings: fSettings });
    result.current.addExcludedAsset(fAssets[0].uuid);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fAssets[0].uuid));
  });

  it('removeExcludedAsset() dispatchs a remove action', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseAccounts({ settings: fSettings });
    const targetUuid = fSettings.excludedAssets[0];
    result.current.removeExcludedAsset(targetUuid);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(targetUuid));
  });

  it('setFavoriteAccounts() dispatchs an updateMany action', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseAccounts({ settings: fSettings });
    const uuids = fAccounts.map((a) => a.uuid);
    result.current.setFavoriteAccounts(uuids);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(uuids));
  });

  it('setNode() sets node', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseAccounts({ settings: fSettings });
    const node = 'mynode';
    result.current.setNode(node);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(node));
  });

  it('updateRates() sets rates', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseAccounts({ settings: fSettings });
    result.current.updateRates(fRates);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fRates));
  });

  // it('exportState()', () => {
  //   const mockExport = jest.fn().mockImplementation(() => fLocalStorage);
  //   const { result } = renderUseAccounts({ settings: fSettings });
  //   expect(result.current.exportState()).toBe(JSON.stringify(fLocalStorage));
  // });

  // it('importState()', () => {
  //   const mockDispatch = getUseDispatchMock();
  //   const { result } = renderUseAccounts({ settings: fSettings });
  //   const newLS = JSON.stringify({ ...fLocalStorage, settings: fSettings });
  //   result.current.importState(newLS);
  //   expect(mockDispatch).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       payload: newLS,
  //       action: importState.name
  //     })
  //   );
  // });
});
