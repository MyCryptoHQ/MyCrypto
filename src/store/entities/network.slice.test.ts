import { NETWORKS } from '@database';
import { Network, NetworkId } from '@types';

import slice from './network.slice';

const reducer = slice.reducer;
const { create, update } = slice.actions;

describe('NetworkSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: 'dummyAction' });
    expect(Object.keys(actual)).toEqual([
      'Ethereum',
      'Ropsten',
      'Kovan',
      'Rinkeby',
      'Goerli',
      'ETC',
      'UBQ',
      'EXP',
      'POA',
      'TOMO',
      'MUSIC',
      'EGEM',
      'CLO',
      'RSK',
      'RSK_TESTNET',
      'GO',
      'GO_TESTNET',
      'ESN',
      'AQUA',
      'AKA',
      'PIRL',
      'ATH',
      'ETHO',
      'MIX',
      'REOSC',
      'ARTIS_SIGMA1',
      'ARTIS_TAU1',
      'THUNDERCORE',
      'WEB',
      'METADIUM',
      'DEXON',
      'ETI',
      'ASK',
      'AUX',
      'ERE',
      'VOLTA',
      'EnergyWebChain',
      'HARDLYDIFFICULT'
    ]);
  });
  it('create(): adds an entity by id', () => {
    const entity = { id: 'Ropsten' } as Network;
    const state = ({ Ethereum: { id: 'Ethereum' } } as unknown) as Record<NetworkId, Network>;
    const actual = reducer(state, create(entity));
    const expected = { ...state, [entity.id]: entity };
    expect(actual).toEqual(expected);
  });

  it('update(): updates an entity', () => {
    const entity = { id: 'Ethereum', isCustom: false } as Network;
    const state = { [entity.id]: entity } as typeof NETWORKS;
    const modifiedEntity = { ...entity, address: '0x1' } as Network;
    const actual = reducer(state, update(modifiedEntity));
    const expected = { [entity.id]: modifiedEntity };
    expect(actual).toEqual(expected);
  });
});
