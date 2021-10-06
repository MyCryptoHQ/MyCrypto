import { waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { OPENSEA_IMAGE_PROXY_API } from '@config';
import { fAccount, fNFTCollections, fNFTs } from '@fixtures';
import { getNFTURL } from '@utils';

import { OpenSeaService } from '.';

describe('OpenSea', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it('fetchAllAssets fetches multiple pages of assets for owner', async () => {
    const promise = OpenSeaService.fetchAllAssets(fAccount.address);
    expect(mockAxios.get).toHaveBeenCalledWith(
      'v1/assets',
      expect.objectContaining({ params: { limit: 50, offset: 0, owner: fAccount.address } })
    );
    const page1 = new Array(50).fill(fNFTs[0]);
    mockAxios.mockResponse({ data: { assets: page1 } });
    await waitFor(() =>
      expect(mockAxios.get).toHaveBeenCalledWith(
        'v1/assets',
        expect.objectContaining({ params: { limit: 50, offset: 50, owner: fAccount.address } })
      )
    );
    const page2 = fNFTs;
    mockAxios.mockResponse({ data: { assets: page2 } });
    const result = await promise;
    expect(result).toStrictEqual([...page1, ...page2]);
  });

  it('fetchAssets fetches assets for owner', async () => {
    const promise = OpenSeaService.fetchAssets(fAccount.address, 0);
    expect(mockAxios.get).toHaveBeenCalledWith(
      'v1/assets',
      expect.objectContaining({ params: { limit: 50, offset: 0, owner: fAccount.address } })
    );
    mockAxios.mockResponse({ data: { assets: fNFTs } });
    const result = await promise;
    expect(result).toStrictEqual(fNFTs);
  });

  it('fetchCollections fetches collections for owner', async () => {
    const promise = OpenSeaService.fetchCollections(fAccount.address);
    expect(mockAxios.get).toHaveBeenCalledWith(
      'v1/collections',
      expect.objectContaining({ params: { limit: 300, asset_owner: fAccount.address } })
    );
    mockAxios.mockResponse({ data: fNFTCollections });
    const result = await promise;
    expect(result).toStrictEqual(fNFTCollections);
  });

  it('proxyAssets fetches collections for owner', async () => {
    const promise = OpenSeaService.proxyAssets(fNFTs);
    expect(mockAxios.post).toHaveBeenCalledWith(
      '',
      expect.objectContaining({
        assetURLs: fNFTs.map((a) => getNFTURL(a))
      }),
      { baseURL: OPENSEA_IMAGE_PROXY_API }
    );
    mockAxios.mockResponse();
    const result = await promise;
    expect(result).toBe(true);
  });
});
