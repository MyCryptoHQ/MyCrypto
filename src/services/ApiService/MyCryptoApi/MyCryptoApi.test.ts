import { waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { fAssets, fTxTypeMetas } from '@fixtures';

import { default as MyCryptoApiService } from './MyCryptoApi';

jest.mock('@vendor', () => ({
  ...jest.requireActual('@vendor'),
  // Mock return value of isClaimed()
  FallbackProvider: jest.fn().mockImplementation(() => ({
    call: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve('0x0000000000000000000000000000000000000000000000000000000000000001')
      )
  }))
}));

describe('MyCryptoApiService', () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it("can get tx type's meta", async () => {
    const schemaMeta = MyCryptoApiService.instance.getSchemaMeta();

    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());

    mockAxios.mockResponse({
      data: fTxTypeMetas
    });

    const result = await schemaMeta;
    expect(result).toBe(fTxTypeMetas);
  });

  it('can get assets and includes an `isCustom` param', async () => {
    const assets = MyCryptoApiService.instance.getAssets();
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());

    mockAxios.mockResponse({
      data: fAssets.reduce((acc, asset) => {
        return {
          ...acc,
          [asset.uuid]: asset
        };
      }, {})
    });

    const result = await assets;
    expect(result).toStrictEqual(
      fAssets.reduce((acc, asset) => {
        return {
          ...acc,
          [asset.uuid]: {
            ...asset,
            isCustom: false
          }
        };
      }, {})
    );
  });
});
