import { BigNumber } from '@ethersproject/bignumber';
import { mockAppState } from 'test-utils';

import { ETHUUID, REPV2UUID } from '@config';
import { fAccount, fAccounts, fTransaction } from '@fixtures';
import { IAccount, ITxReceipt, TUuid } from '@types';

import { getAccounts, initialState, default as slice } from './account.slice';

const reducer = slice.reducer;
const { create, createMany, destroy, update, updateMany, reset, updateAssets } = slice.actions;

describe('AccountSlice', () => {
  it('create(): adds an entity by uuid', () => {
    const entity = { uuid: 'random' } as IAccount;
    const actual = reducer(initialState, create(entity));
    const expected = [entity];
    expect(actual).toEqual(expected);
  });

  it('createMany(): adds multiple entities by uuid', () => {
    const a1 = { uuid: 'first' } as IAccount;
    const a2 = { uuid: 'second' } as IAccount;
    const a3 = { uuid: 'third' } as IAccount;
    const actual = reducer([a1], createMany([a2, a3]));
    const expected = [a1, a2, a3];
    expect(actual).toEqual(expected);
  });

  it('destroy(): deletes an entity by uuid', () => {
    const a1 = { uuid: 'todestroy' } as IAccount;
    const a2 = { uuid: 'tokeep' } as IAccount;
    const state = [a1, a2];
    const actual = reducer(state, destroy(a1.uuid));
    const expected = [a2];
    expect(actual).toEqual(expected);
  });

  it('update(): updates an entity', () => {
    const entity = { uuid: 'random', address: '0x0' } as IAccount;
    const state = [entity];
    const modifiedEntity = { ...entity, address: '0x1' } as IAccount;
    const actual = reducer(state, update(modifiedEntity));
    const expected = [modifiedEntity];
    expect(actual).toEqual(expected);
  });

  it('updateMany(): updates mulitple entities', () => {
    const a1 = { uuid: 'random', address: '0x0' } as IAccount;
    const a2 = { uuid: 'random1', address: '0x1' } as IAccount;
    const a3 = { uuid: 'random2', address: '0x2' } as IAccount;
    const state = [a1, a2, a3];
    const modifiedEntities = [
      { ...a1, address: '0xchanged' } as IAccount,
      { ...a2, address: '0xchanged1' } as IAccount
    ];
    const actual = reducer(state, updateMany(modifiedEntities));
    const expected = [...modifiedEntities, a3];
    expect(actual).toEqual(expected);
  });

  it('updateAssets(): updates assets of accounts', () => {
    const state = [fAccounts[0], fAccounts[1]];
    const assetBalances = [
      {
        uuid: REPV2UUID,
        balance: '1000000000000000000',
        mtime: 1607602775360
      },
      {
        uuid: ETHUUID as TUuid,
        balance: '2000000000000000000',
        mtime: 1607602775360
      }
    ];
    const payload = {
      [fAccounts[0].uuid]: assetBalances
    };
    const actual = reducer(state, updateAssets(payload));
    const expected = [{ ...fAccounts[0], assets: assetBalances }, fAccounts[1]];
    expect(actual).toEqual(expected);
  });

  it('reset(): can reset', () => {
    const entity = { uuid: 'random', address: '0x0' } as IAccount;
    const state = [entity];
    const actual = reducer(state, reset());
    expect(actual).toEqual(initialState);
  });

  it('getAccounts(): transforms serialized BNs to BNs', () => {
    const state = mockAppState({
      accounts: [
        {
          ...fAccount,
          transactions: [
            ({ ...fTransaction, gasUsed: fTransaction.gasLimit } as unknown) as ITxReceipt
          ]
        }
      ]
    });
    const actual = getAccounts(state);
    expect(actual).toEqual([
      {
        ...fAccount,
        transactions: [
          {
            ...fTransaction,
            gasLimit: BigNumber.from(fTransaction.gasLimit),
            gasPrice: BigNumber.from(fTransaction.gasPrice),
            gasUsed: BigNumber.from(fTransaction.gasLimit),
            value: BigNumber.from(fTransaction.value)
          }
        ]
      }
    ]);
  });
});
