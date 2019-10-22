import BN from 'bn.js';
import { buffers, delay } from 'redux-saga';
import {
  call,
  select,
  put,
  take,
  apply,
  actionChannel,
  race,
  cancel,
  fork
} from 'redux-saga/effects';
import { cloneableGenerator, SagaIteratorClone, createMockTask } from 'redux-saga/utils';
import { Wei } from 'libs/units';
import { hexStringToNumber } from 'utils/formatters';
import { makeTransaction, getTransactionFields } from 'libs/transaction';
import * as derivedSelectors from 'features/selectors';
import { configMetaTypes, configMetaSelectors, configNodesSelectors } from 'features/config';
import { walletTypes, walletSelectors } from 'features/wallet';
import { scheduleSelectors, scheduleTypes } from 'features/schedule';
import { notificationsActions } from 'features/notifications';
import { transactionFieldsTypes, transactionFieldsActions } from '../fields';
import { transactionsSelectors } from 'features/transactions';
import { SavedTransaction } from 'types/transactions';
import * as transactionTypes from '../types';
import * as types from './types';
import * as actions from './actions';
import * as sagas from './sagas';
import { isSchedulingEnabled } from 'features/schedule/selectors';

describe('Network Sagas', () => {
  describe('From', () => {
    describe('handleFromRequest*', () => {
      const walletInst: any = {
        getAddressString: jest.fn()
      };
      const fromAddress = '0xa';
      const gens: any = {};
      gens.gen = cloneableGenerator(sagas.handleFromRequest)();
      let random: () => number;

      beforeAll(() => {
        random = Math.random;
        Math.random = () => 0.001;
      });

      afterAll(() => {
        Math.random = random;
      });

      it('should select getWalletInst', () => {
        expect(gens.gen.next().value).toEqual(select(walletSelectors.getWalletInst));
      });

      it('should handle errors as expected', () => {
        gens.clone = gens.gen.clone();
        expect(gens.clone.next(false).value).toEqual(
          put(
            notificationsActions.showNotification(
              'warning',
              'Your wallets address could not be fetched'
            )
          )
        );
        expect(gens.clone.next().value).toEqual(put(actions.getFromFailed()));
        expect(gens.clone.next().done).toEqual(true);
      });

      it('should apply walletInst.getAddress', () => {
        expect(gens.gen.next(walletInst).value).toEqual(
          apply(walletInst, walletInst.getAddressString)
        );
      });

      it('should put getFromSucceeded', () => {
        expect(gens.gen.next(fromAddress).value).toEqual(
          put(actions.getFromSucceeded(fromAddress))
        );
      });
    });
  });
  describe('Gas', () => {
    describe('shouldEstimateGas*', () => {
      const offline = false;
      const autoGasLimitEnabled = true;
      const addressMessage = undefined;
      const transaction: any = 'transaction';
      const tx = { transaction };
      const rest: any = {
        mock1: 'mock1',
        mock2: 'mock2'
      };
      const transactionFields = {
        gasLimit: 'gasLimit',
        gasPrice: 'gasPrice',
        nonce: 'nonce',
        chainId: 'chainId',
        ...rest
      };
      const action: any = {
        type: transactionFieldsTypes.TransactionFieldsActions.TO_FIELD_SET,
        payload: {
          value: 'value',
          raw: 'raw'
        }
      };

      const gen = sagas.shouldEstimateGas();

      it('should take expected types', () => {
        expect(gen.next().value).toEqual(
          take([
            transactionFieldsTypes.TransactionFieldsActions.TO_FIELD_SET,
            transactionFieldsTypes.TransactionFieldsActions.VALUE_FIELD_SET,
            transactionFieldsTypes.TransactionFieldsActions.DATA_FIELD_SET,
            transactionTypes.TransactionActions.ETHER_TO_TOKEN_SWAP,
            transactionTypes.TransactionActions.TOKEN_TO_TOKEN_SWAP,
            transactionTypes.TransactionActions.TOKEN_TO_ETHER_SWAP,
            configMetaTypes.ConfigMetaActions.TOGGLE_AUTO_GAS_LIMIT,
            scheduleTypes.ScheduleActions.TOGGLE_SET
          ])
        );
      });

      it('should select getOffline', () => {
        expect(gen.next(action).value).toEqual(select(configMetaSelectors.getOffline));
      });

      it('should select autoGasLimitEnabled', () => {
        expect(gen.next(offline).value).toEqual(select(configMetaSelectors.getAutoGasLimitEnabled));
      });

      it('should select getCurrentToAddressMessage', () => {
        expect(gen.next(autoGasLimitEnabled).value).toEqual(
          select(derivedSelectors.getCurrentToAddressMessage)
        );
      });

      it('should select getTransaction', () => {
        expect(gen.next(addressMessage).value).toEqual(select(derivedSelectors.getTransaction));
      });

      it('should call getTransactionFields with transaction', () => {
        expect(gen.next(tx).value).toEqual(call(getTransactionFields, transaction));
      });

      it('should select isSchedulingEnabled', () => {
        expect(gen.next(transactionFields).value).toEqual(
          select(scheduleSelectors.isSchedulingEnabled)
        );
      });

      it('should put estimatedGasRequested with rest', () => {
        expect(gen.next(false).value).toEqual(put(actions.estimateGasRequested(rest)));
      });
    });

    describe('estimateGas*', () => {
      const offline = false;
      const autoGasLimitEnabled = true;
      const requestChan = 'requestChan';
      const payload: any = {
        mock1: 'mock1',
        mock2: 'mock2'
      };
      const action = { payload };
      const node: any = {
        estimateGas: jest.fn()
      };
      const walletInst: any = {
        getAddressString: jest.fn()
      };
      const from = '0xa';
      const txObj = { ...payload, from };
      const gasLimit = Wei('100');
      const successfulGasEstimationResult = {
        gasLimit
      };

      const unsuccessfulGasEstimationResult = {
        gasLimit: null
      };
      const gasSetOptions = {
        raw: gasLimit.toString(),
        value: gasLimit
      };

      const gens: { [name: string]: any } = {};
      gens.successCase = cloneableGenerator(sagas.estimateGas)();

      let random: () => number;
      beforeAll(() => {
        random = Math.random;
        Math.random = () => 0.001;
      });

      afterAll(() => {
        Math.random = random;
      });

      it('should yield actionChannel', () => {
        const expected = JSON.stringify(
          actionChannel(types.TransactionNetworkActions.ESTIMATE_GAS_REQUESTED, buffers.sliding(1))
        );
        const result = JSON.stringify(gens.successCase.next().value);
        expect(expected).toEqual(result);
      });

      it('should select autoGasLimit', () => {
        expect(gens.successCase.next(requestChan).value).toEqual(
          select(configMetaSelectors.getAutoGasLimitEnabled)
        );
      });

      it('should select getOffline', () => {
        expect(gens.successCase.next(autoGasLimitEnabled).value).toEqual(
          select(configMetaSelectors.getOffline)
        );
      });

      it('should take requestChan', () => {
        expect(gens.successCase.next(offline).value).toEqual(take(requestChan));
      });

      it('should call delay', () => {
        expect(gens.successCase.next(action).value).toEqual(call(delay, 250));
      });

      it('should select getNodeLib', () => {
        expect(gens.successCase.next().value).toEqual(select(configNodesSelectors.getNodeLib));
      });

      it('should select getWalletInst', () => {
        expect(gens.successCase.next(node).value).toEqual(select(walletSelectors.getWalletInst));
      });

      it('should apply walletInst', () => {
        expect(gens.successCase.next(walletInst).value).toEqual(
          apply(walletInst, walletInst.getAddressString)
        );
      });

      it('should race between node.estimate gas and a 10 second timeout', () => {
        gens.failCase = gens.successCase.clone();
        expect(gens.successCase.next(from).value).toEqual(
          race({
            gasLimit: apply(node, node.estimateGas, [txObj]),
            timeout: call(delay, 10000)
          })
        );
      });

      it('should select isSchedulingEnabled', () => {
        gens.timeOutCase = gens.successCase.clone();
        expect(gens.successCase.next(successfulGasEstimationResult).value).toEqual(
          select(isSchedulingEnabled)
        );
      });

      it('should select isEtherTransaction', () => {
        expect(gens.successCase.next(false).value).toEqual(
          select(derivedSelectors.isEtherTransaction)
        );
      });

      it('should put setGasLimitField', () => {
        expect(gens.successCase.next(false).value).toEqual(
          put(transactionFieldsActions.setGasLimitField(gasSetOptions))
        );
      });

      it('should put estimateGasSucceeded', () => {
        expect(gens.successCase.next().value).toEqual(put(actions.estimateGasSucceeded()));
      });

      describe('when it times out', () => {
        it('should put estimateGasTimedout ', () => {
          expect(gens.timeOutCase.next(unsuccessfulGasEstimationResult).value).toEqual(
            put(actions.estimateGasTimedout())
          );
        });
        it('should call localGasEstimation', () => {
          expect(gens.timeOutCase.next(actions.estimateGasFailed()).value).toEqual(
            call(sagas.localGasEstimation, payload)
          );
        });
      });

      describe('when it throws', () => {
        it('should catch and put estimateGasFailed', () => {
          expect(gens.failCase.throw().value).toEqual(put(actions.estimateGasFailed()));
        });

        it('should call localGasEstimation', () => {
          expect(gens.failCase.next(actions.estimateGasFailed()).value).toEqual(
            call(sagas.localGasEstimation, payload)
          );
        });
      });
    });

    describe('localGasEstimation', () => {
      const payload: any = {
        mock1: 'mock1',
        mock2: 'mock2'
      };
      const tx = {
        getBaseFee: jest.fn()
      };
      const gasLimit = Wei('100');

      const gen = sagas.localGasEstimation(payload);
      it('should call makeTransaction with payload', () => {
        expect(gen.next().value).toEqual(call(makeTransaction, payload));
      });

      it('should apply tx.getBaseFee', () => {
        expect(gen.next(tx).value).toEqual(apply(tx, tx.getBaseFee));
      });

      it('should put setGasLimitField', () => {
        expect(gen.next(gasLimit).value).toEqual(
          put(
            transactionFieldsActions.setGasLimitField({
              raw: gasLimit.toString(),
              value: gasLimit
            })
          )
        );
      });
    });

    describe('setAddressMessageGasLimit*', () => {
      const gens = cloneableGenerator(sagas.setAddressMessageGasLimit)();
      const gen = gens.clone();
      let noAutoGen: SagaIteratorClone;
      let noMessageGen: SagaIteratorClone;
      const addressMessage = {
        gasLimit: 123456,
        msg: 'Thanks for donating, er, investing in SCAM'
      };

      it('should select getAutoGasLimitEnabled', () => {
        expect(gen.next().value).toEqual(select(configMetaSelectors.getAutoGasLimitEnabled));
      });

      it('should select getCurrentToAddressMessage', () => {
        noAutoGen = gen.clone();
        expect(gen.next(true).value).toEqual(select(derivedSelectors.getCurrentToAddressMessage));
      });

      it('should put setGasLimitField', () => {
        noMessageGen = gen.clone();
        expect(gen.next(addressMessage).value).toEqual(
          put(
            transactionFieldsActions.setGasLimitField({
              raw: addressMessage.gasLimit.toString(),
              value: new BN(addressMessage.gasLimit)
            })
          )
        );
      });

      it('should do nothing if getAutoGasLimitEnabled is false', () => {
        noAutoGen.next(false);
        expect(noAutoGen.next(addressMessage).done).toBeTruthy();
      });

      it('should do nothing if getCurrentToAddressMessage is undefined', () => {
        expect(noMessageGen.next(undefined).done).toBeTruthy();
      });
    });
  });
  describe('Nonce', () => {
    describe('handleNonceRequest*', () => {
      const nodeLib = {
        getTransactionCount: jest.fn()
      };
      const walletInst = {
        getAddressString: jest.fn()
      };
      const offline = false;
      const recentTransactions: SavedTransaction[] = JSON.parse(
        JSON.stringify([
          {
            hash: '0x286e4e3bc55f58175da474058359ddbb6db09efc7f94e1741c42ba7e278b0ede',
            from: 'fromaddress',
            chainId: 1,
            nonce: 9,
            to: '0x4f1F9d958AFa2e94dab3f3Ce7192b87daEa39017',
            value: '0x0',
            time: 1544888892465
          },
          {
            hash: '0xecc044b81a794fc567dd389b7709b89a3a0a001dcdd151fc442c57982cfa012b',
            from: 'fromaddress',
            chainId: 11,
            nonce: 8,
            to: '0x3d1F9d958AFa2e94dab3f3Ce7362b87daEa39017',
            value: '0x0',
            time: 1544811728723
          }
        ])
      );
      const transactionCountString = '0x9';
      const transactionCount = 9;
      const transaction: any = {
        hash: '0xecc044b81a794fc567dd389b7709b89a3a0a001dcdd151fc442c57982cfa012b',
        from: 'fromaddress',
        chainId: 11,
        nonce: 8,
        to: '0x3d1F9d958AFa2e94dab3f3Ce7362b87daEa39017',
        value: '0x0',
        time: 1544811728723
      };
      const tx = { transaction };

      const gens: any = {};
      gens.gen = cloneableGenerator(sagas.handleNonceRequest)();
      let random: () => number;

      beforeAll(() => {
        random = Math.random;
        Math.random = () => 0.001;
      });

      afterAll(() => {
        Math.random = random;
      });

      it('should select getNodeLib', () => {
        expect(gens.gen.next().value).toEqual(select(configNodesSelectors.getNodeLib));
      });

      it('should select getWalletInstance', () => {
        expect(gens.gen.next(nodeLib).value).toEqual(select(walletSelectors.getWalletInst));
      });

      it('should exit if being called without a wallet inst', () => {
        gens.noWallet = gens.gen.clone();
        gens.noWallet.next(null); // No wallet inst
        expect(gens.noWallet.next(offline).done).toEqual(false);
      });

      it('should select getOffline', () => {
        expect(gens.gen.next(walletInst).value).toEqual(select(configMetaSelectors.getOffline));
      });

      it('should exit if being called while offline', () => {
        gens.offline = gens.gen.clone();
        expect(gens.offline.next(true).done).toEqual(false);
      });

      it('should apply walletInst.getAddressString', () => {
        expect(gens.gen.next(offline).value).toEqual(
          apply(walletInst, walletInst.getAddressString)
        );
      });

      it('should apply nodeLib.getTransactionCount', () => {
        expect(gens.gen.next(transactionCountString).value).toEqual(
          apply(nodeLib, nodeLib.getTransactionCount, [transactionCountString])
        );
      });

      it('should call hexStringToNumber', () => {
        expect(gens.gen.next(transactionCountString).value).toEqual(
          call(hexStringToNumber, transactionCountString)
        );
      });

      it('should select transactionSelectors', () => {
        expect(gens.gen.next(transactionCount).value).toEqual(
          select(transactionsSelectors.getRecentTransactions)
        );
      });

      it('should select transactionSelectors', () => {
        expect(gens.gen.next(recentTransactions).value).toEqual(
          select(derivedSelectors.getTransaction)
        );
      });

      it('should call getTransactionFields', () => {
        expect(gens.gen.next(tx).value).toEqual(call(getTransactionFields, transaction));
      });
    });

    describe('handleNonceRequestWrapper*', () => {
      const gen = sagas.handleNonceRequestWrapper();
      const nonceRequest = createMockTask();

      it('should fork handleNonceRequest', () => {
        expect(gen.next().value).toEqual(fork(sagas.handleNonceRequest));
      });

      it('should take on WALLET_SET', () => {
        expect(gen.next(nonceRequest).value).toEqual(take(walletTypes.WalletActions.SET));
      });

      it('should cancel nonceRequest', () => {
        expect(gen.next().value).toEqual(cancel(nonceRequest));
      });

      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    });
  });
});
