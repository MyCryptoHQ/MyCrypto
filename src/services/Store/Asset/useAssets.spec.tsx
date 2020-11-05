import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
// eslint-disable-next-line import/no-namespace
import * as ReactRedux from 'react-redux';
import { Provider } from 'react-redux';

import { fAssets } from '@fixtures';
import { store } from '@store';
import { Asset, ExtendedAsset, TUuid } from '@types';

import { DataContext, IDataContext } from '../DataManager';
import useAssets from './useAssets';

const getUseDispatchMock = () => {
  const mockDispatch = jest.fn();
  jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(mockDispatch);
  return mockDispatch;
};

const renderUseAssets = ({ assets = [] as ExtendedAsset[] } = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <DataContext.Provider value={({ assets } as any) as IDataContext}>
        {' '}
        {children}
      </DataContext.Provider>
    </Provider>
  );
  return renderHook(() => useAssets(), { wrapper });
};

describe('useAssets', () => {
  it('uses get assets from DataContext', () => {
    const { result } = renderUseAssets({ assets: fAssets });
    expect(result.current.assets).toEqual(fAssets);
  });

  it('createAssetWithID() dispatches a create action', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseAssets({ assets: [] });
    result.current.createAssetWithID(fAssets[0], 'MyUUID' as TUuid);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { ...fAssets[0], uuid: 'MyUUID' } })
    );
  });

  it('getAssetByUUID() finds an asset and returns it', () => {
    const { result } = renderUseAssets({ assets: fAssets });
    expect(result.current.getAssetByUUID(fAssets[0].uuid)).toEqual(fAssets[0]);
  });

  it('addAssetsFromAPI() calls model.updateAll', () => {
    const mockDispatch = getUseDispatchMock();
    const customAssets = fAssets.filter((a) => a.isCustom);
    const { result } = renderUseAssets({ assets: customAssets });
    const defaultAssets = fAssets.filter((a) => !a.isCustom);
    const assets = defaultAssets.reduce((obj, item) => {
      obj[item.uuid] = item;
      return obj;
    }, {} as Record<any, Asset>);
    result.current.addAssetsFromAPI(assets);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: expect.arrayContaining(fAssets) })
    );
  });
});
