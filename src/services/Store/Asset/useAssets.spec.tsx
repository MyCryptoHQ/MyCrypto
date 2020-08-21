import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { fAssets } from '@fixtures';
import { LSKeys, TUuid, ExtendedAsset } from '@types';

import { DataContext, IDataContext } from '../DataManager';
import useAssets from './useAssets';

const renderUseAssets = ({ assets = [] as ExtendedAsset[], createActions = jest.fn() } = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <DataContext.Provider value={({ assets, createActions } as any) as IDataContext}>
      {' '}
      {children}
    </DataContext.Provider>
  );
  return renderHook(() => useAssets(), { wrapper });
};

describe('useAssets', () => {
  it('uses get assets from DataContext ', () => {
    const { result } = renderUseAssets({ assets: fAssets });
    expect(result.current.assets).toEqual(fAssets);
  });

  it('uses a valid data model', () => {
    const createActions = jest.fn();
    renderUseAssets({ createActions });
    expect(createActions).toBeCalledWith(LSKeys.ASSETS);
  });

  it('createAssetWithID() calls model.createWithID', () => {
    const mockCreate = jest.fn();
    const { result } = renderUseAssets({
      assets: [],
      createActions: jest.fn(() => ({ createWithID: mockCreate }))
    });
    result.current.createAssetWithID(fAssets[0], 'MyUUID' as TUuid);
    expect(mockCreate).toBeCalledWith(fAssets[0], 'MyUUID');
  });

  it('getAssetByUUID() finds an asset and returns it', () => {
    const { result } = renderUseAssets({ assets: fAssets });
    expect(result.current.getAssetByUUID(fAssets[0].uuid)).toEqual(fAssets[0]);
  });

  it('addAssetsFromAPI() calls model.updateAll', () => {
    const mockUpdateAll = jest.fn();
    const customAssets = fAssets.filter((a) => a.isCustom);
    const { result } = renderUseAssets({
      assets: customAssets,
      createActions: jest.fn(() => ({ updateAll: mockUpdateAll }))
    });
    const defaultAssets = fAssets.filter((a) => !a.isCustom);
    const assets = defaultAssets.reduce((obj, item) => {
      // @ts-ignore
      obj[item.uuid] = item;
      return obj;
    }, {});
    result.current.addAssetsFromAPI(assets);
    expect(mockUpdateAll).toBeCalledWith(expect.arrayContaining(fAssets));
  });
});
