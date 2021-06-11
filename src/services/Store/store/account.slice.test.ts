import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';
import { call } from 'redux-saga-test-plan/matchers';
import { APP_STATE, expectSaga, mockAppState } from 'test-utils';

import { DEFAULT_NETWORK, ETHUUID, REPV2UUID } from '@config';
import { ITxHistoryType } from '@features/Dashboard/types';
import { NotificationTemplates } from '@features/NotificationsPanel';
import {
  fAccount,
  fAccounts,
  fAssets,
  fContacts,
  fContracts,
  fNetwork,
  fNetworks,
  fSettings,
  fTransaction,
  fTxHistoryAPI,
  fTxReceipt
} from '@fixtures';
import { makeFinishedTxReceipt } from '@helpers';
import { getTimestampFromBlockNum, getTxStatus, ProviderHandler } from '@services/EthService';
import { translateRaw } from '@translations';
import { IAccount, ITxReceipt, ITxStatus, ITxType, NetworkId, TUuid, WalletId } from '@types';
import { fromWei, Wei } from '@utils';

import { toStoreAccount } from '../utils';
import {
  addAccounts,
  addNewAccounts,
  addNewAccountsWorker,
  addTxToAccount,
  addTxToAccountWorker,
  getAccounts,
  getMergedTxHistory,
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
import { createOrUpdateContacts } from './contact.slice';
import { sanitizeAccount } from './helpers';
import { fetchMemberships } from './membership.slice';
import { displayNotification } from './notification.slice';
import { scanTokens } from './tokenScanning.slice';

const reducer = slice.reducer;
const { create, createMany, destroy, update, updateMany, reset, updateAssets } = slice.actions;

jest.mock('uuid/v4', () => jest.fn().mockImplementation(() => 'foo'));

Date.now = jest.fn().mockImplementation(() => 1623248693738);

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

  describe('getMergedTxHistory', () => {
    const defaultAppState = {
      accounts: fAccounts,
      networks: APP_STATE.networks,
      addressBook: fContacts,
      contracts: fContracts,
      assets: fAssets
    };
    it('uses tx history from store', () => {
      const state = {
        ...mockAppState(defaultAppState),
        txHistory: { history: [fTxHistoryAPI], error: false }
      };
      const actual = getMergedTxHistory(state);

      expect(actual).toEqual([
        {
          ...fTxHistoryAPI,
          amount: fromWei(Wei(BigNumber.from(fTxHistoryAPI.value).toString()), 'ether'),
          asset: fAssets[0],
          baseAsset: fAssets[0],
          fromAddressBookEntry: undefined,
          toAddressBookEntry: undefined,
          receiverAddress: fTxHistoryAPI.recipientAddress,
          nonce: BigNumber.from(fTxHistoryAPI.nonce).toString(),
          networkId: DEFAULT_NETWORK,
          blockNumber: BigNumber.from(fTxHistoryAPI.blockNumber!).toNumber(),
          gasLimit: BigNumber.from(fTxHistoryAPI.gasLimit),
          gasPrice: BigNumber.from(fTxHistoryAPI.gasPrice),
          gasUsed: BigNumber.from(fTxHistoryAPI.gasUsed || 0),
          value: parseEther(fromWei(Wei(BigNumber.from(fTxHistoryAPI.value).toString()), 'ether'))
        }
      ]);
    });

    it('uses transactions from Account', () => {
      const state = {
        ...mockAppState({
          ...defaultAppState,
          accounts: [{ ...fAccount, transactions: [fTxReceipt] }]
        }),
        txHistory: { history: [], error: false }
      };
      const actual = getMergedTxHistory(state);

      expect(actual).toEqual([
        {
          ...fTxReceipt,
          gasLimit: BigNumber.from(fTxReceipt.gasLimit),
          gasPrice: BigNumber.from(fTxReceipt.gasPrice),
          value: BigNumber.from(fTxReceipt.value),
          networkId: fNetwork.id,
          timestamp: 0,
          toAddressBookEntry: undefined,
          txType: ITxHistoryType.OUTBOUND,
          fromAddressBookEntry: fContacts[0]
        }
      ]);
    });

    it('merges transactions and prioritizes account txs', () => {
      const state = {
        ...mockAppState({
          ...defaultAppState,
          accounts: [
            {
              ...fAccount,
              transactions: [
                {
                  ...fTxReceipt,
                  hash: '0xbc9a016464ac9d52d29bbe9feec9e5cb7eb3263567a1733650fe8588d426bf40'
                }
              ]
            }
          ]
        }),
        txHistory: { history: [fTxHistoryAPI], error: false }
      };
      const actual = getMergedTxHistory(state);
      expect(actual).toHaveLength(1);
      expect(actual).toEqual([
        {
          ...fTxReceipt,
          gasLimit: BigNumber.from(fTxReceipt.gasLimit),
          gasPrice: BigNumber.from(fTxReceipt.gasPrice),
          value: BigNumber.from(fTxReceipt.value),
          hash: '0xbc9a016464ac9d52d29bbe9feec9e5cb7eb3263567a1733650fe8588d426bf40',
          networkId: fNetwork.id,
          timestamp: 0,
          toAddressBookEntry: undefined,
          txType: ITxHistoryType.OUTBOUND,
          fromAddressBookEntry: fContacts[0]
        }
      ]);
    });

    it('merges transactions', () => {
      const state = {
        ...mockAppState({
          ...defaultAppState,
          accounts: [
            {
              ...fAccount,
              transactions: [fTxReceipt]
            }
          ]
        }),
        txHistory: { history: [fTxHistoryAPI], error: false }
      };
      const actual = getMergedTxHistory(state);
      expect(actual).toHaveLength(2);
    });
  });

  describe('addNewAccountsWorker', () => {
    const appState = mockAppState({
      accounts: [],
      networks: APP_STATE.networks,
      assets: fAssets,
      addressBook: [],
      contracts: []
    });

    const { label, ...newAccount } = sanitizeAccount(fAccounts[0]);
    const newAccounts = [
      {
        ...newAccount,
        assets: fAccounts[0].assets
          .slice(0, 1)
          .map((a) => ({ uuid: a.uuid, balance: '0', mtime: 1623248693738 }))
      }
    ];

    it('adds new accounts', () => {
      return expectSaga(
        addNewAccountsWorker,
        addNewAccounts({
          networkId: 'Ethereum',
          accountType: WalletId.WALLETCONNECT,
          newAccounts
        })
      )
        .withState(appState)
        .put(
          createOrUpdateContacts([
            {
              label: 'WalletConnect Account 1',
              address: fAccounts[0].address,
              notes: '',
              network: 'Ethereum',
              uuid: 'foo' as TUuid
            }
          ])
        )
        .put(addAccounts(newAccounts))
        .put(fetchMemberships(newAccounts))
        .put(scanTokens({ accounts: newAccounts }))
        .put(
          displayNotification({
            templateName: NotificationTemplates.walletAdded,
            templateData: { address: newAccounts[0].address }
          })
        )
        .silentRun();
    });

    it('doesnt run if no accounts passed', () => {
      return expectSaga(
        addNewAccountsWorker,
        addNewAccounts({
          networkId: 'Ethereum',
          accountType: WalletId.WALLETCONNECT,
          newAccounts: []
        })
      )
        .withState(appState)
        .not.put(addAccounts(newAccounts))
        .silentRun();
    });

    it('displays notification if accounts failed to add', () => {
      return expectSaga(
        addNewAccountsWorker,
        addNewAccounts({
          networkId: 'Ethereum',
          accountType: WalletId.WALLETCONNECT,
          newAccounts
        })
      )
        .withState(
          mockAppState({
            accounts: newAccounts,
            networks: APP_STATE.networks,
            assets: fAssets,
            addressBook: [],
            contracts: []
          })
        )
        .put(displayNotification({ templateName: NotificationTemplates.walletsNotAdded }))
        .silentRun();
    });

    it('shows different notification for multiple accounts', () => {
      const accounts = [newAccounts[0], newAccounts[0]];
      return expectSaga(
        addNewAccountsWorker,
        addNewAccounts({
          networkId: 'Ethereum',
          accountType: WalletId.WALLETCONNECT,
          newAccounts: accounts
        })
      )
        .withState(
          mockAppState({
            accounts: [],
            networks: APP_STATE.networks,
            assets: fAssets,
            addressBook: [],
            contracts: []
          })
        )
        .put(
          displayNotification({
            templateName: NotificationTemplates.walletsAdded,
            templateData: { accounts }
          })
        )
        .silentRun();
    });

    it('updates unknown labels', () => {
      return expectSaga(
        addNewAccountsWorker,
        addNewAccounts({
          networkId: 'Ethereum',
          accountType: WalletId.WALLETCONNECT,
          newAccounts
        })
      )
        .withState(
          mockAppState({
            accounts: [],
            networks: APP_STATE.networks,
            assets: fAssets,
            addressBook: [
              {
                uuid: 'foo' as TUuid,
                address: fAccounts[0].address,
                label: translateRaw('NO_LABEL'),
                notes: '',
                network: 'Ethereum'
              }
            ],
            contracts: []
          })
        )
        .put(
          createOrUpdateContacts([
            {
              label: 'WalletConnect Account 1',
              address: fAccounts[0].address,
              notes: '',
              network: 'Ethereum',
              uuid: 'foo' as TUuid
            }
          ])
        )
        .silentRun();
    });

    it('doesnt update labels if no updates are needed', () => {
      return expectSaga(
        addNewAccountsWorker,
        addNewAccounts({
          networkId: 'Ethereum',
          accountType: WalletId.WALLETCONNECT,
          newAccounts
        })
      )
        .withState(
          mockAppState({
            accounts: [],
            networks: APP_STATE.networks,
            assets: fAssets,
            addressBook: [
              {
                uuid: 'foo' as TUuid,
                address: fAccounts[0].address,
                label: 'Foobar',
                notes: '',
                network: 'Ethereum'
              }
            ],
            contracts: []
          })
        )
        .not.put(
          createOrUpdateContacts([
            {
              label: 'WalletConnect Account 1',
              address: fAccounts[0].address,
              notes: '',
              network: 'Ethereum',
              uuid: 'foo' as TUuid
            }
          ])
        )
        .silentRun();
    });
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
      const contact = { ...fContacts[0], network: 'Ethereum' as NetworkId };
      return expectSaga(pendingTxPolling)
        .withState({
          ...mockAppState({
            accounts: [account],
            assets: fAssets,
            networks: APP_STATE.networks,
            addressBook: [],
            contracts: fContracts
          }),
          txHistory: { history: [fTxHistoryAPI] }
        })
        .provide([
          [call.fn(getTxStatus), ITxStatus.SUCCESS],
          [call.fn(getTimestampFromBlockNum), timestamp]
        ])
        .put(
          addTxToAccount({
            account: toStoreAccount(
              account,
              fAssets,
              APP_STATE.networks.find((n) => n.id === 'Ethereum')!,
              contact
            ),
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
      const contact = { ...fContacts[0], network: 'Ethereum' as NetworkId };
      return expectSaga(pendingTxPolling)
        .withState({
          ...mockAppState({
            accounts: [account],
            assets: fAssets,
            networks: APP_STATE.networks,
            addressBook: [contact],
            contracts: fContracts
          }),
          txHistory: { history: [fTxHistoryAPI] }
        })
        .put(
          updateAccount({
            ...toStoreAccount(
              account,
              fAssets,
              APP_STATE.networks.find((n) => n.id === 'Ethereum')!,
              contact
            ),
            transactions: [overwrittenTx]
          })
        )
        .silentRun();
    });

    it('handles pending overwritten transaction via tx history api', () => {
      const overwrittenTx = {
        ...fTxHistoryAPI,
        nonce: pendingTx.nonce,
        from: pendingTx.from,
        hash: 'bla'
      };
      const account = { ...fAccounts[0], transactions: [pendingTx] };
      const contact = { ...fContacts[0], network: 'Ethereum' as NetworkId };
      return expectSaga(pendingTxPolling)
        .withState({
          ...mockAppState({
            accounts: [account],
            assets: fAssets,
            networks: APP_STATE.networks,
            addressBook: [contact],
            contracts: fContracts
          }),
          txHistory: { history: [overwrittenTx] }
        })
        .put(
          updateAccount({
            ...toStoreAccount(
              account,
              fAssets,
              APP_STATE.networks.find((n) => n.id === 'Ethereum')!,
              contact
            ),
            transactions: []
          })
        )
        .silentRun();
    });

    it('skips if pending tx not mined', () => {
      ProviderHandler.prototype.getTransactionByHash = jest.fn().mockResolvedValue(undefined);
      const account = { ...fAccounts[0], transactions: [pendingTx] };
      return expectSaga(pendingTxPolling)
        .withState({
          ...mockAppState({
            accounts: [account],
            assets: fAssets,
            networks: APP_STATE.networks,
            addressBook: [{ ...fContacts[0], network: 'Ethereum' }],
            contracts: fContracts
          }),
          txHistory: { history: [fTxHistoryAPI] }
        })
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
        .withState({
          ...mockAppState({
            accounts: [account],
            assets: fAssets,
            networks: APP_STATE.networks,
            addressBook: [{ ...fContacts[0], network: 'Ethereum' }],
            contracts: fContracts
          }),
          txHistory: { history: [fTxHistoryAPI] }
        })
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
