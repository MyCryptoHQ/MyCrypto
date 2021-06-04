import { BigNumber } from '@ethersproject/bignumber';
import { call } from 'redux-saga-test-plan/matchers';
import { APP_STATE, expectSaga, mockAppState } from 'test-utils';

import { ETHUUID, REPV2UUID } from '@config';
import {
  fAccount,
  fAccounts,
  fAssets,
  fContacts,
  fNetworks,
  fSettings,
  fTransaction,
  fTxReceipt
} from '@fixtures';
import { makeFinishedTxReceipt } from '@helpers';
import { getTimestampFromBlockNum, getTxStatus, ProviderHandler } from '@services/EthService';
import { IAccount, ITxReceipt, ITxStatus, ITxType, TUuid } from '@types';

import {
  addTxToAccount,
  addTxToAccountWorker,
  getAccounts,
  getStoreAccounts,
  initialState,
  pendingTxPolling,
  resetAndCreateAccount,
  resetAndCreateManyAccounts,
  selectAccountTxs,
  selectCurrentAccounts,
  default as slice,
  updateAccount
} from './account.slice';
import { sanitizeAccount } from './helpers';
import { fetchMemberships } from './membership.slice';
import { scanTokens } from './tokenScanning.slice';

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

  it('resetAndCreate(): reset state and add an entities', () => {
    const a1 = { uuid: 'first' } as IAccount;
    const a2 = { uuid: 'second' } as IAccount;
    const actual = reducer([a1], resetAndCreateAccount(a2));
    const expected = [a2];
    expect(actual).toEqual(expected);
  });

  it('resetAndCreateMany(): reset state and adds multiple entities', () => {
    const a1 = { uuid: 'first' } as IAccount;
    const a2 = { uuid: 'second' } as IAccount;
    const a3 = { uuid: 'third' } as IAccount;
    const actual = reducer([a1], resetAndCreateManyAccounts([a2, a3]));
    const expected = [a2, a3];
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

  it('getStoreAccounts(): Adds assets, network and label to selected accounts', () => {
    const accounts = fAccounts.map((a) => sanitizeAccount(a));
    const state = mockAppState({
      accounts: [accounts[0]],
      assets: fAssets,
      networks: fNetworks,
      addressBook: fContacts
    });

    const actual = getStoreAccounts(state);

    expect(actual).toEqual([{ ...fAccounts[0], label: fContacts[1].label }]);
  });

  it('selectCurrentAccounts(): returns only favorite accounts', () => {
    const state = mockAppState({
      accounts: fAccounts,
      settings: fSettings
    });
    const actual = selectCurrentAccounts(state);
    expect(actual).toEqual([fAccounts[0]]);
  });

  it('selectAccountsTxs(): returns account transactions', () => {
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
    const actual = selectAccountTxs(state);
    expect(actual).toEqual([
      {
        chainId: 3,
        data: '0x',
        gasLimit: { _hex: '0x5208', _isBigNumber: true },
        gasPrice: { _hex: '0xee6b2800', _isBigNumber: true },
        gasUsed: { _hex: '0x5208', _isBigNumber: true },
        nonce: '0x9',
        status: undefined,
        to: '0x909f74Ffdc223586d0d30E78016E707B6F5a45E2',
        value: { _hex: '0x038d7ea4c68000', _isBigNumber: true }
      }
    ]);
  });

  describe('addTxToAccountWorker', () => {
    it('updates account with tx', () => {
      return expectSaga(addTxToAccountWorker, addTxToAccount({ account: fAccount, tx: fTxReceipt }))
        .put(updateAccount({ ...fAccount, transactions: [fTxReceipt] }))
        .silentRun();
    });

    it('scans for tokens if tx is a swap', () => {
      return expectSaga(
        addTxToAccountWorker,
        addTxToAccount({
          account: fAccount,
          tx: {
            ...fTxReceipt,
            txType: ITxType.SWAP,
            status: ITxStatus.SUCCESS,
            metadata: { receivingAsset: ETHUUID }
          }
        })
      )
        .withState(mockAppState({ assets: fAssets }))
        .put(scanTokens({ accounts: [fAccount], assets: [fAssets[0]] }))
        .silentRun();
    });

    it('scans for membership if tx is a membership purchase', () => {
      return expectSaga(
        addTxToAccountWorker,
        addTxToAccount({
          account: fAccount,
          tx: { ...fTxReceipt, txType: ITxType.PURCHASE_MEMBERSHIP, status: ITxStatus.SUCCESS }
        })
      )
        .put(fetchMemberships([fAccount]))
        .silentRun();
    });

    it('overwrites existing tx', () => {
      const tx = { ...fTxReceipt, status: ITxStatus.SUCCESS };
      return expectSaga(
        addTxToAccountWorker,
        addTxToAccount({
          account: { ...fAccount, transactions: [fTxReceipt] },
          tx
        })
      )
        .put(updateAccount({ ...fAccount, transactions: [tx] }))
        .silentRun();
    });
  });

  describe('pendingTxPolling', () => {
    const blockNum = 12568779;
    const timestamp = 1622817966;
    ProviderHandler.prototype.getTransactionByHash = jest
      .fn()
      .mockResolvedValue({ blockNumber: blockNum });
    const pendingTx = {
      ...fTxReceipt,
      gasLimit: BigNumber.from(fTxReceipt.gasLimit),
      gasPrice: BigNumber.from(fTxReceipt.gasPrice),
      gasUsed: BigNumber.from(fTxReceipt.gasLimit),
      value: BigNumber.from(fTxReceipt.value),
      asset: fAssets[0],
      baseAsset: fAssets[0]
    };

    it('updates pending tx to be successful', () => {
      const account = { ...fAccounts[0], transactions: [pendingTx] };
      return expectSaga(pendingTxPolling)
        .withState(
          mockAppState({
            accounts: [account],
            assets: fAssets,
            networks: APP_STATE.networks,
            addressBook: [{ ...fContacts[0], network: 'Ethereum' }]
          })
        )
        .provide([
          [call.fn(getTxStatus), ITxStatus.SUCCESS],
          [call.fn(getTimestampFromBlockNum), timestamp]
        ])
        .put(
          addTxToAccount({
            account: sanitizeAccount(account),
            tx: makeFinishedTxReceipt(pendingTx, ITxStatus.SUCCESS, timestamp, blockNum)
          })
        )
        .silentRun();
    });

    it('handles pending overwritten transaction', () => {
      const overwrittenTx = makeFinishedTxReceipt(
        { ...pendingTx, hash: 'bla' },
        ITxStatus.SUCCESS,
        timestamp,
        blockNum
      );
      const account = { ...fAccounts[0], transactions: [pendingTx, overwrittenTx] };
      return expectSaga(pendingTxPolling)
        .withState(
          mockAppState({
            accounts: [account],
            assets: fAssets,
            networks: APP_STATE.networks,
            addressBook: [{ ...fContacts[0], network: 'Ethereum' }]
          })
        )
        .put(
          updateAccount({
            ...sanitizeAccount(account),
            transactions: [overwrittenTx]
          })
        )
        .silentRun();
    });

    it('skips if pending tx not mined', () => {
      ProviderHandler.prototype.getTransactionByHash = jest.fn().mockResolvedValue(undefined);
      const account = { ...fAccounts[0], transactions: [pendingTx] };
      return expectSaga(pendingTxPolling)
        .withState(
          mockAppState({
            accounts: [account],
            assets: fAssets,
            networks: APP_STATE.networks,
            addressBook: [{ ...fContacts[0], network: 'Ethereum' }]
          })
        )
        .not.put(
          addTxToAccount({
            account: sanitizeAccount(account),
            tx: makeFinishedTxReceipt(pendingTx, ITxStatus.SUCCESS, timestamp, blockNum)
          })
        )
        .silentRun();
    });

    it('skips if fails to lookup timestamp or status', () => {
      ProviderHandler.prototype.getTransactionByHash = jest
        .fn()
        .mockResolvedValue({ blockNumber: blockNum });
      const account = { ...fAccounts[0], transactions: [pendingTx] };
      return expectSaga(pendingTxPolling)
        .withState(
          mockAppState({
            accounts: [account],
            assets: fAssets,
            networks: APP_STATE.networks,
            addressBook: [{ ...fContacts[0], network: 'Ethereum' }]
          })
        )
        .provide([
          [call.fn(getTxStatus), undefined],
          [call.fn(getTimestampFromBlockNum), undefined]
        ])
        .not.put(
          addTxToAccount({
            account: sanitizeAccount(account),
            tx: makeFinishedTxReceipt(pendingTx, ITxStatus.SUCCESS, timestamp, blockNum)
          })
        )
        .silentRun();
    });
  });
});
