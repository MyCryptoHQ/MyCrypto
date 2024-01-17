import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';
import { call } from 'redux-saga-test-plan/matchers';
import { APP_STATE, expectSaga, mockAppState } from 'test-utils';

import { DEFAULT_NETWORK, ETHUUID, REPV1UUID, REPV2UUID } from '@config';
import { ITxHistoryType } from '@features/Dashboard/types';
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
  fTransactionEIP1559,
  fTxHistoryAPI,
  fTxReceipt,
  fTxTypeMetas
} from '@fixtures';
import { makeFinishedTxReceipt } from '@helpers';
import { ProviderHandler } from '@services/EthService';
import { translateRaw } from '@translations';
import {
  IAccount,
  ILegacyTxObject,
  ISettings,
  ITxReceipt,
  ITxStatus,
  ITxType,
  ITxType2Object,
  NetworkId,
  NotificationTemplates,
  TUuid,
  WalletId
} from '@types';
import { fromWei, Wei } from '@utils';

import { getAccountsAssetsBalances } from '../BalanceService';
import { toStoreAccount } from '../utils';
import {
  addNewAccounts,
  addNewAccountsWorker,
  addTxToAccount,
  addTxToAccountWorker,
  fetchBalances,
  getAccounts,
  getMergedTxHistory,
  getStoreAccounts,
  getUserAssets,
  initialState,
  pendingTxPolling,
  removeAccountTx,
  removeAccountTxWorker,
  resetAndCreateAccount,
  resetAndCreateManyAccounts,
  selectAccountTxs,
  selectCurrentAccounts,
  default as slice,
  updateAccount,
  updateAccounts
} from './account.slice';
import { createOrUpdateContacts } from './contact.slice';
import { sanitizeAccount } from './helpers';
import { fetchMemberships } from './membership.slice';
import { displayNotification } from './notification.slice';
import { scanTokens } from './tokenScanning.slice';

const reducer = slice.reducer;
const {
  create,
  createMany,
  createOrUpdateMany,
  destroy,
  update,
  updateMany,
  reset,
  updateAssets
} = slice.actions;

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

  it('createOrUpdateMany(): adds multiple entities by uuid and overwrites if needed', () => {
    const a1 = { uuid: 'first' } as IAccount;
    const a2 = { uuid: 'first', label: 'foo' } as IAccount;
    const a3 = { uuid: 'second' } as IAccount;
    const actual = reducer([a1], createOrUpdateMany([a2, a3]));
    const expected = [a2, a3];
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
            gasPrice: BigNumber.from((fTransaction as ILegacyTxObject).gasPrice),
            gasUsed: BigNumber.from(fTransaction.gasLimit),
            nonce: BigNumber.from(fTransaction.nonce),
            value: BigNumber.from(fTransaction.value)
          }
        ]
      }
    ]);
  });

  it('getAccounts(): supports EIP 1559 transaactions', () => {
    const state = mockAppState({
      accounts: [
        {
          ...fAccount,
          transactions: [
            ({
              ...fTransactionEIP1559,
              gasUsed: fTransactionEIP1559.gasLimit
            } as unknown) as ITxReceipt
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
            ...fTransactionEIP1559,
            gasLimit: BigNumber.from(fTransactionEIP1559.gasLimit),
            maxFeePerGas: BigNumber.from((fTransactionEIP1559 as ITxType2Object).maxFeePerGas),
            maxPriorityFeePerGas: BigNumber.from(
              (fTransactionEIP1559 as ITxType2Object).maxPriorityFeePerGas
            ),
            gasUsed: BigNumber.from(fTransactionEIP1559.gasLimit),
            nonce: BigNumber.from(fTransactionEIP1559.nonce),
            value: BigNumber.from(fTransactionEIP1559.value)
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

  it('getUserAssets(): gets user accounts assets and filter excluded assets', () => {
    const walletConnectAccount = fAccounts.filter((a) => a.wallet === WalletId.WALLETCONNECT)[0];
    const viewOnlyAccount = fAccounts.filter((a) => a.wallet === WalletId.VIEW_ONLY)[0];

    const state = mockAppState({
      accounts: [sanitizeAccount(walletConnectAccount), sanitizeAccount(viewOnlyAccount)],
      assets: fAssets,
      networks: fNetworks,
      addressBook: fContacts,
      settings: { excludedAssets: [REPV1UUID] } as ISettings
    });

    const actual = getUserAssets(state);
    expect(actual).toEqual(walletConnectAccount.assets.filter((a) => a.uuid !== REPV1UUID));
  });

  it('selectCurrentAccounts(): returns only favorite accounts', () => {
    const state = mockAppState({
      accounts: fAccounts,
      settings: fSettings,
      networks: fNetworks,
      assets: fAssets,
      addressBook: []
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
        gasLimit: BigNumber.from('0x5208'),
        gasPrice: BigNumber.from('0xee6b2800'),
        gasUsed: BigNumber.from('0x5208'),
        nonce: BigNumber.from('0x9'),
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
        txHistory: { history: [fTxHistoryAPI], error: false, txTypeMeta: fTxTypeMetas }
      };
      const actual = getMergedTxHistory(state);

      expect(actual).toEqual([
        {
          ...fTxHistoryAPI,
          amount: fromWei(Wei(BigNumber.from(fTxHistoryAPI.value).toString()), 'ether'),
          asset: fAssets[0],
          baseAsset: fAssets[0],
          fromAddressBookEntry: {
            address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
            label: 'WalletConnect Account 2',
            network: 'Ethereum',
            notes: '',
            uuid: '4ffb0d4a-adf3-1990-5eb9-fe78e613f70c'
          },
          toAddressBookEntry: undefined,
          receiverAddress: fTxHistoryAPI.recipientAddress,
          nonce: BigNumber.from(fTxHistoryAPI.nonce),
          networkId: DEFAULT_NETWORK,
          blockNumber: BigNumber.from(fTxHistoryAPI.blockNumber!).toNumber(),
          gasLimit: BigNumber.from(fTxHistoryAPI.gasLimit),
          gasPrice: BigNumber.from(fTxHistoryAPI.gasPrice),
          gasUsed: BigNumber.from(fTxHistoryAPI.gasUsed ?? 0),
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
        txHistory: { history: [], error: false, txTypeMeta: fTxTypeMetas }
      };
      const actual = getMergedTxHistory(state);

      expect(actual).toEqual([
        {
          ...fTxReceipt,
          gasLimit: BigNumber.from(fTxReceipt.gasLimit),
          gasPrice: BigNumber.from(fTxReceipt.gasPrice),
          nonce: BigNumber.from(fTxReceipt.nonce),
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
        txHistory: { history: [fTxHistoryAPI], error: false, txTypeMeta: fTxTypeMetas }
      };
      const actual = getMergedTxHistory(state);
      expect(actual).toHaveLength(1);
      expect(actual).toEqual([
        {
          ...fTxReceipt,
          gasLimit: BigNumber.from(fTxReceipt.gasLimit),
          gasPrice: BigNumber.from(fTxReceipt.gasPrice),
          nonce: BigNumber.from(fTxReceipt.nonce),
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
        txHistory: { history: [fTxHistoryAPI], error: false, txTypeMeta: fTxTypeMetas }
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
      contracts: [],
      settings: fSettings
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
        .put(createOrUpdateMany(newAccounts))
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

    it('overwrites existing accounts', () => {
      const output = [
        {
          ...newAccounts[0],
          assets: [
            {
              uuid: '356a192b-7913-504c-9457-4d18c28d46e6' as TUuid,
              balance: BigNumber.from('0x00'),
              mtime: 1623248693738,
              name: 'Ether',
              networkId: 'Ethereum',
              type: 'base',
              ticker: 'ETH',
              decimal: 18,
              isCustom: false
            }
          ]
        }
      ];
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
            accounts: [{ ...newAccounts[0], wallet: WalletId.METAMASK }],
            networks: APP_STATE.networks,
            assets: fAssets,
            addressBook: [],
            contracts: [],
            settings: fSettings
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
        .put(createOrUpdateMany(output))
        .put(fetchMemberships(output))
        .put(scanTokens({ accounts: output }))
        .put(
          displayNotification({
            templateName: NotificationTemplates.walletAdded,
            templateData: { address: newAccounts[0].address }
          })
        )
        .silentRun();
    });

    it('exits demo mode if needed', () => {
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
            addressBook: [],
            contracts: [],
            settings: { ...fSettings, isDemoMode: true }
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
        .put(resetAndCreateManyAccounts(newAccounts))
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
        .not.put(createMany(newAccounts))
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
            contracts: [],
            settings: fSettings
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
            contracts: [],
            settings: fSettings
          })
        )
        .put(
          displayNotification({
            templateName: NotificationTemplates.walletsAdded,
            templateData: { numOfAccounts: accounts.length }
          })
        )
        .silentRun();
    });

    it('updates labels', () => {
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
            contracts: [],
            settings: fSettings
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
    ProviderHandler.prototype.getTransactionReceipt = jest
      .fn()
      .mockResolvedValue({ blockNumber: blockNum, status: 1 });
    ProviderHandler.prototype.getBlockByNumber = jest.fn().mockResolvedValue({ timestamp });
    const pendingTx = {
      ...fTxReceipt,
      gasLimit: BigNumber.from(fTxReceipt.gasLimit),
      gasPrice: BigNumber.from(fTxReceipt.gasPrice),
      gasUsed: BigNumber.from(fTxReceipt.gasLimit),
      value: BigNumber.from(fTxReceipt.value),
      nonce: BigNumber.from(fTxReceipt.nonce),
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
          txHistory: { history: [fTxHistoryAPI], txTypeMeta: fTxTypeMetas }
        })
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
          txHistory: { history: [fTxHistoryAPI], txTypeMeta: fTxTypeMetas }
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
          txHistory: { history: [overwrittenTx], txTypeMeta: fTxTypeMetas }
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

    it("skips if pending tx not mined and nonce hasn't been used", () => {
      ProviderHandler.prototype.getTransactionByHash = jest.fn().mockResolvedValue(undefined);
      ProviderHandler.prototype.getTransactionCount = jest
        .fn()
        .mockResolvedValue(fTxReceipt.nonce - 1);
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
          txHistory: { history: [fTxHistoryAPI], txTypeMeta: fTxTypeMetas }
        })
        .not.put(
          addTxToAccount({
            account: sanitizeAccount(account),
            tx: makeFinishedTxReceipt(pendingTx, ITxStatus.SUCCESS, timestamp, blockNum)
          })
        )
        .silentRun();
    });
    it('removes tx if pending tx not mined, but nonce is used already', () => {
      ProviderHandler.prototype.getTransactionReceipt = jest.fn().mockResolvedValue(undefined);
      ProviderHandler.prototype.getTransactionCount = jest
        .fn()
        .mockResolvedValue(fTxReceipt.nonce + 1);
      const account = { ...fAccounts[0], transactions: [pendingTx] };
      const contact = { ...fContacts[0], network: 'Ethereum' as NetworkId };
      return expectSaga(pendingTxPolling)
        .withState({
          ...mockAppState({
            accounts: [account],
            assets: fAssets,
            networks: APP_STATE.networks,
            addressBook: [{ ...fContacts[0], network: 'Ethereum' }],
            contracts: fContracts
          }),
          txHistory: { history: [fTxHistoryAPI], txTypeMeta: fTxTypeMetas }
        })
        .put(
          removeAccountTx({
            account: toStoreAccount(
              account,
              fAssets,
              APP_STATE.networks.find((n) => n.id === 'Ethereum')!,
              contact
            ),
            txHash: pendingTx.hash
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
          txHistory: { history: [fTxHistoryAPI], txTypeMeta: fTxTypeMetas }
        })
        .not.put(
          addTxToAccount({
            account: sanitizeAccount(account),
            tx: makeFinishedTxReceipt(pendingTx, ITxStatus.SUCCESS, timestamp, blockNum)
          })
        )
        .silentRun();
    });
  });

  it('fetchBalances(): fetch assets balances from accounts', () => {
    const result = [fAccounts[1]];
    const initialState = mockAppState({
      accounts: [fAccounts[1]],
      assets: fAssets,
      networks: fNetworks,
      addressBook: [],
      settings: { dashboardAccounts: [fAccounts[1].uuid] } as ISettings
    });

    return expectSaga(fetchBalances)
      .withState(initialState)
      .provide([[call.fn(getAccountsAssetsBalances), result]])
      .select(selectCurrentAccounts)
      .call(getAccountsAssetsBalances, [fAccounts[1]])
      .put(updateAccounts(result))
      .silentRun();
  });
});

describe('removeAccountTxWorker', () => {
  it('updates account to remove tx', () => {
    return expectSaga(
      removeAccountTxWorker,
      removeAccountTx({
        account: { ...fAccount, transactions: [fTxReceipt] },
        txHash: fTxReceipt.hash
      })
    )
      .put(updateAccount(fAccount))
      .silentRun();
  });
});
