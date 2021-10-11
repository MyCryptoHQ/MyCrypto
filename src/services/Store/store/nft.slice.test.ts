import { expectSaga, mockAppState } from 'test-utils';

import { fAccounts, fNFTCollections, fNFTs } from '@fixtures';
import { OpenSeaService } from '@services/ApiService/OpenSea';

import slice, {
  fetchError,
  fetchNFTs,
  initialState,
  nftSaga,
  setCollections,
  setFetched,
  setNFTs
} from './nft.slice';

const reducer = slice.reducer;

describe('NFTSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('setFetched(): sets fetched', () => {
    const actual = reducer(initialState, setFetched(true));
    const expected = { ...initialState, fetched: true };
    expect(actual).toEqual(expected);
  });

  it('setNFTs(): sets nfts', () => {
    const actual = reducer(initialState, setNFTs(fNFTs));
    const expected = { ...initialState, nfts: fNFTs };
    expect(actual).toEqual(expected);
  });

  it('setCollections(): sets collections', () => {
    const actual = reducer(initialState, setCollections(fNFTCollections));
    const expected = { ...initialState, collections: fNFTCollections };
    expect(actual).toEqual(expected);
  });

  it('fetchError(): sets an error', () => {
    const actual = reducer(initialState, fetchError('foo'));
    const expected = { ...initialState, error: 'foo' };
    expect(actual).toEqual(expected);
  });
});

describe('nftSaga()', () => {
  it('fetches nfts', () => {
    return expectSaga(nftSaga)
      .withState(
        mockAppState({
          accounts: fAccounts
        })
      )
      .provide({
        call(effect, next) {
          if (effect.args[1] === OpenSeaService.fetchCollections) {
            return fNFTCollections;
          } else if (effect.args[1] === OpenSeaService.fetchAllAssets) {
            return fNFTs;
          } else if (effect.fn === OpenSeaService.proxyAssets) {
            return true;
          }

          return next();
        }
      })
      .put(setNFTs(fNFTs))
      .put(setCollections(fNFTCollections))
      .dispatch(fetchNFTs())
      .silentRun();
  });

  it('can sets error if the call fails', () => {
    const error = new Error('error');
    return expectSaga(nftSaga)
      .withState(mockAppState({ accounts: fAccounts }))
      .provide({
        call() {
          throw error;
        }
      })
      .put(fetchError(error.message))
      .dispatch(fetchNFTs())
      .silentRun();
  });
});
