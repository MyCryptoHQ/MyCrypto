import BN from 'bn.js';
import { SagaIterator, buffers, delay } from 'redux-saga';
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

import { Address, toTokenBase, Wei, Nonce, fromTokenBase, fromWei } from 'libs/units';
import { computeIndexingHash, makeTransaction, getTransactionFields } from 'libs/transaction';
import { isValidENSAddress, getIsValidAddressFunction } from 'libs/validators';
import configuredStore from 'features/store';
import * as selectors from 'features/selectors';
import * as configMetaTypes from 'features/config/meta/types';
import * as configMetaSelectors from 'features/config/meta/selectors';
import * as configNodesSelectors from 'features/config/nodes/selectors';
import * as configSelectors from 'features/config/selectors';
import * as ensTypes from 'features/ens/types';
import * as ensActions from 'features/ens/actions';
import * as ensSelectors from 'features/ens/selectors';
import * as walletTypes from 'features/wallet/types';
import * as walletSelectors from 'features/wallet/selectors';
import * as scheduleActions from 'features/schedule/actions';
import * as scheduleSelectors from 'features/schedule/selectors';
import * as notificationsActions from 'features/notifications/actions';
import * as transactionFieldsTypes from './fields/types';
import * as transactionFieldsActions from './fields/actions';
import * as transactionMetaActions from './meta/actions';
import * as transactionMetaSelectors from './meta/selectors';
import * as transactionNetworkTypes from './network/types';
import * as transactionNetworkActions from './network/actions';
import * as transactionSignActions from './sign/actions';
import * as types from './types';
import * as actions from './actions';
import * as sagas from './sagas';
import * as helpers from './helpers';

/* tslint:disable */
import './selectors'; //throws if not imported
/* tslint:enable */

configuredStore.getState();

describe('transaction: Sagas', () => {
  describe('Current', () => {
    const itShouldBeDone = (gen: SagaIterator) => {
      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    };

    describe('setCurrentTo*', () => {
      const isValidAddress = getIsValidAddressFunction(1);
      const data = {} as any;

      describe('with valid Ethereum address', () => {
        const raw = '0xa';
        const ethAddrPayload = {
          raw,
          value: Address(raw)
        };
        const ethAddrAction: any = {
          payload: raw
        };

        data.validEthGen = sagas.setCurrentToSaga(ethAddrAction);

        it('should select getIsValidAddressFn', () => {
          expect(data.validEthGen.next().value).toEqual(
            select(configSelectors.getIsValidAddressFn)
          );
        });

        it('should call isValidAddress', () => {
          expect(data.validEthGen.next(isValidAddress).value).toEqual(call(isValidAddress, raw));
        });

        it('should call isValidENSAddress', () => {
          expect(data.validEthGen.next(raw).value).toEqual(call(isValidENSAddress, raw));
        });

        it('should call setField', () => {
          expect(data.validEthGen.next(raw).value).toEqual(call(sagas.setField, ethAddrPayload));
        });
      });

      describe('with invalid Ethereum address, valid ENS address', () => {
        const raw = 'testing.eth';
        const resolvedAddress = '0xa';
        const [domain] = raw.split('.');
        const ensAddrPayload = {
          raw,
          value: null
        };
        const ensAddrAction: any = {
          payload: raw
        };
        data.validEnsGen = sagas.setCurrentToSaga(ensAddrAction);

        it('should select getIsValidAddressFn', () => {
          expect(data.validEnsGen.next().value).toEqual(
            select(configSelectors.getIsValidAddressFn)
          );
        });

        it('should call isValidAddress', () => {
          expect(data.validEnsGen.next(isValidAddress).value).toEqual(call(isValidAddress, raw));
        });

        it('should call isValidENSAddress', () => {
          expect(data.validEnsGen.next(false).value).toEqual(call(isValidENSAddress, raw));
        });

        it('should call setField', () => {
          expect(data.validEnsGen.next(true).value).toEqual(call(sagas.setField, ensAddrPayload));
        });

        it('should put resolveDomainRequested', () => {
          expect(data.validEnsGen.next().value).toEqual(
            put(ensActions.resolveDomainRequested(domain))
          );
        });

        it('should take ENS type keys', () => {
          expect(data.validEnsGen.next().value).toEqual(
            take([
              ensTypes.ENSActions.RESOLVE_DOMAIN_FAILED,
              ensTypes.ENSActions.RESOLVE_DOMAIN_SUCCEEDED,
              ensTypes.ENSActions.RESOLVE_DOMAIN_CACHED
            ])
          );
        });

        it('should select getResolvedAddress', () => {
          expect(data.validEnsGen.next().value).toEqual(
            select(ensSelectors.getResolvedAddress, true)
          );
        });

        it('should call setField', () => {
          expect(data.validEnsGen.next(resolvedAddress).value).toEqual(
            call(sagas.setField, { raw, value: Address(resolvedAddress) })
          );
        });
      });
    });

    describe('setField', () => {
      const raw = '0xa';
      const payload = {
        raw,
        value: Address(raw)
      };
      const etherTransaction = cloneableGenerator(sagas.setField)(payload);
      it('should select etherTransaction', () => {
        expect(etherTransaction.next().value).toEqual(select(selectors.isEtherTransaction));
      });

      it('should put setTokenTo field if its a token transaction ', () => {
        const tokenTransaction = etherTransaction.clone();

        expect(tokenTransaction.next(false).value).toEqual(
          put(transactionMetaActions.setTokenTo(payload))
        );
        expect(tokenTransaction.next().done).toBe(true);
      });
      it('should put setToField if its an etherTransaction', () => {
        expect(etherTransaction.next(true).value).toEqual(
          put(transactionFieldsActions.setToField(payload))
        );
        expect(etherTransaction.next().done).toBe(true);
      });
    });

    describe('valueHandler', () => {
      const action: any = { payload: '5.1' };
      const zeroAction: any = { payload: '0' };
      const setter = transactionFieldsActions.setValueField;
      const decimal = 1;
      const gen: { [key: string]: SagaIteratorClone } = {};

      const failCases = {
        invalidDecimal: 0,
        invalidNumber: {
          decimal: 1,
          action: { payload: 'x' }
        },
        invalidZeroToken: {
          unit: 'GNT',
          isEth: false,
          setter: transactionMetaActions.setTokenValue
        }
      };

      gen.pass = cloneableGenerator(sagas.valueHandler)(action, setter);
      gen.zeroPass = cloneableGenerator(sagas.valueHandler)(zeroAction, setter);
      gen.invalidNumber = cloneableGenerator(sagas.valueHandler)(
        failCases.invalidNumber.action as any,
        setter
      );
      gen.invalidZeroToken = cloneableGenerator(sagas.valueHandler)(
        zeroAction,
        transactionMetaActions.setTokenValue
      );
      const value = toTokenBase(action.payload, decimal);
      const zeroValue = toTokenBase(zeroAction.payload, decimal);
      const unit = 'eth';
      const isEth = true;

      it('should select getDecimal', () => {
        expect(gen.pass.next().value).toEqual(select(transactionMetaSelectors.getDecimal));
        expect(gen.zeroPass.next().value).toEqual(select(transactionMetaSelectors.getDecimal));
        expect(gen.invalidNumber.next().value).toEqual(select(transactionMetaSelectors.getDecimal));
        expect(gen.invalidZeroToken.next().value).toEqual(
          select(transactionMetaSelectors.getDecimal)
        );
      });

      it('should select getUnit', () => {
        gen.invalidDecimal = gen.pass.clone();
        expect(gen.pass.next(decimal).value).toEqual(select(selectors.getUnit));
        expect(gen.zeroPass.next(decimal).value).toEqual(select(selectors.getUnit));
        expect(gen.invalidNumber.next(decimal).value).toEqual(select(selectors.getUnit));
        expect(gen.invalidDecimal.next(failCases.invalidDecimal).value).toEqual(
          select(selectors.getUnit)
        );
        expect(gen.invalidZeroToken.next(decimal).value).toEqual(select(selectors.getUnit));
      });

      it('should select isEtherTransaction', () => {
        expect(gen.pass.next(unit).value).toEqual(select(selectors.isEtherTransaction));
        expect(gen.zeroPass.next(unit).value).toEqual(select(selectors.isEtherTransaction));
        expect(gen.invalidNumber.next(unit).value).toEqual(select(selectors.isEtherTransaction));
        expect(gen.invalidDecimal.next(unit).value).toEqual(select(selectors.isEtherTransaction));
        expect(gen.invalidZeroToken.next(failCases.invalidZeroToken.unit).value).toEqual(
          select(selectors.isEtherTransaction)
        );
      });

      it('should fail on invalid number or decimal and put null as value', () => {
        expect(gen.invalidNumber.next(isEth).value).toEqual(
          put(setter({ raw: failCases.invalidNumber.action.payload, value: null }))
        );
        expect(gen.invalidDecimal.next(isEth).value).toEqual(
          put(setter({ raw: action.payload, value: null }))
        );
      });

      it('should fail if token is given zero value and put null as value', () => {
        expect(gen.invalidZeroToken.next(failCases.invalidZeroToken.isEth).value).toEqual(
          put(failCases.invalidZeroToken.setter({ raw: zeroAction.payload, value: null }))
        );
      });

      it('should call isValid', () => {
        expect(gen.pass.next(isEth).value).toEqual(call(helpers.validateInput, value, unit));
        expect(gen.zeroPass.next(isEth).value).toEqual(
          call(helpers.validateInput, zeroValue, unit)
        );
      });

      it('should put setter', () => {
        expect(gen.pass.next(true).value).toEqual(put(setter({ raw: action.payload, value })));
        expect(gen.zeroPass.next(true).value).toEqual(
          put(
            setter({
              raw: zeroAction.payload,
              value: zeroValue
            })
          )
        );
      });

      it('handles floats without lead zero', () => {
        const leadZeroValue = {
          decimal: 18,
          action: {
            payload: '.1'
          }
        };
        const g = cloneableGenerator(sagas.valueHandler)(leadZeroValue.action as any, setter);

        expect(g.next().value).toEqual(select(transactionMetaSelectors.getDecimal));
        expect(g.next(leadZeroValue.decimal).value).toEqual(select(selectors.getUnit));
        expect(g.next(unit).value).toEqual(select(selectors.isEtherTransaction));
        expect(g.next(isEth).value).not.toEqual(
          put(setter({ raw: leadZeroValue.action.payload, value: null }))
        );
      });

      itShouldBeDone(gen.pass);
      itShouldBeDone(gen.zeroPass);
    });

    describe('setCurrentValue*', () => {
      const action: any = { payload: '5' };
      const gen = sagas.setCurrentValueSaga(action);
      it('should select isEtherTransaction', () => {
        expect(gen.next().value).toEqual(select(selectors.isEtherTransaction));
      });
      it('should call valueHandler', () => {
        expect(gen.next(selectors.isEtherTransaction).value).toEqual(
          call(sagas.valueHandler, action, transactionFieldsActions.setValueField)
        );
      });
      itShouldBeDone(gen);
    });

    describe('revalidateCurrentValue*', () => {
      const sharedLogic = (
        gen: SagaIterator,
        etherTransaction: boolean,
        currVal: any,
        reparsedValue: boolean
      ) => {
        it('should select isEtherTransaction', () => {
          expect(gen.next().value).toEqual(select(selectors.isEtherTransaction));
        });

        it('should select getCurrentValue', () => {
          expect(gen.next(etherTransaction).value).toEqual(select(selectors.getCurrentValue));
        });

        it('should call reparseCurrentValue', () => {
          expect(gen.next(currVal).value).toEqual(call(sagas.reparseCurrentValue, currVal));
        });

        it('should select getUnit', () => {
          expect(gen.next(reparsedValue).value).toEqual(select(selectors.getUnit));
        });
      };

      describe('when !reparsedValue', () => {
        const etherTransaction = false;
        const currVal = {
          raw: 'raw1'
        };
        const reparsedValue = false;
        const gen = sagas.revalidateCurrentValue();

        sharedLogic(gen, etherTransaction, currVal, reparsedValue);

        it('should put with setTokenValue', () => {
          expect(gen.next().value).toEqual(
            put(
              transactionMetaActions.setTokenValue({
                raw: currVal.raw,
                value: null
              })
            )
          );
        });

        itShouldBeDone(gen);
      });

      describe('when reparsedValue', () => {
        const etherTransaction = true;
        const currVal = {
          raw: 'raw1'
        };
        const reparsedValue: any = {
          value: 'value',
          raw: 'raw'
        };
        const unit = 'unit';
        const isValid = true;
        const gen = sagas.revalidateCurrentValue();
        sharedLogic(gen, etherTransaction, currVal, reparsedValue);

        it('should call validateInput', () => {
          expect(gen.next(unit).value).toEqual(
            call(helpers.validateInput, reparsedValue.value, unit)
          );
        });

        it('should put setValueField', () => {
          expect(gen.next(isValid).value).toEqual(
            put(
              transactionFieldsActions.setValueField({
                raw: reparsedValue.raw,
                value: reparsedValue.value
              } as any)
            )
          );
        });

        itShouldBeDone(gen);
      });
    });

    describe('isValueDifferent', () => {
      it('should be truthy when raw differs', () => {
        const curVal: selectors.ICurrentValue = { raw: 'a', value: new BN(0) };
        const newVal: selectors.ICurrentValue = { raw: 'b', value: new BN(0) };
        expect(sagas.isValueDifferent(curVal, newVal)).toBeTruthy();
      });

      it('should be falsy when value is the same BN', () => {
        const curVal: selectors.ICurrentValue = { raw: '', value: new BN(1) };
        const newVal: selectors.ICurrentValue = { raw: '', value: new BN(1) };
        expect(sagas.isValueDifferent(curVal, newVal)).toBeFalsy();
      });

      it('should be truthy when value is a different BN', () => {
        const curVal: selectors.ICurrentValue = { raw: '', value: new BN(1) };
        const newVal: selectors.ICurrentValue = { raw: '', value: new BN(2) };
        expect(sagas.isValueDifferent(curVal, newVal)).toBeTruthy();
      });

      it('should be truthy when value is not the same and not both BNs', () => {
        const curVal: selectors.ICurrentValue = { raw: '', value: new BN(1) };
        const newVal: selectors.ICurrentValue = { raw: '', value: null };
        expect(sagas.isValueDifferent(curVal, newVal)).toBeTruthy();
      });
    });

    describe('reparseCurrentValue*', () => {
      const decimal = 5;

      const sharedLogic = (gen: SagaIterator, isEth: boolean) => {
        it('should select isEtherTransaction', () => {
          expect(gen.next().value).toEqual(select(selectors.isEtherTransaction));
        });

        it('should select getDecimal', () => {
          expect(gen.next(isEth).value).toEqual(select(transactionMetaSelectors.getDecimal));
        });
      };

      describe('when eth tx value is positive number and valid decimal', () => {
        const value: any = {
          raw: '100.0000'
        };
        const gen = sagas.reparseCurrentValue(value);

        sharedLogic(gen, true);

        it('should return correctly', () => {
          expect(gen.next(decimal).value).toEqual({
            raw: value.raw,
            value: toTokenBase(value.raw, decimal)
          });
        });

        itShouldBeDone(gen);
      });

      describe('when eth tx value is zero and decimal is valid', () => {
        const value: any = {
          raw: '0'
        };
        const gen = sagas.reparseCurrentValue(value);

        sharedLogic(gen, true);

        it('should return correctly', () => {
          expect(gen.next(decimal).value).toEqual({
            raw: value.raw,
            value: toTokenBase(value.raw, decimal)
          });
        });

        itShouldBeDone(gen);
      });

      describe('when eth tx value is invalid', () => {
        const value: any = {
          raw: 'invalidNumber'
        };
        const gen = sagas.reparseCurrentValue(value);

        sharedLogic(gen, true);

        it('should return null', () => {
          expect(gen.next(decimal).value).toEqual(null);
        });

        itShouldBeDone(gen);
      });

      describe('when non-eth tx value is zero and valid decimal', () => {
        const value: any = {
          raw: '0'
        };
        const gen = sagas.reparseCurrentValue(value);

        sharedLogic(gen, false);

        it('should return null', () => {
          expect(gen.next(decimal).value).toEqual(null);
        });

        itShouldBeDone(gen);
      });
    });
  });
  describe('Network', () => {
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
          expect(gens.clone.next().value).toEqual(put(transactionNetworkActions.getFromFailed()));
          expect(gens.clone.next().done).toEqual(true);
        });

        it('should apply walletInst.getAddress', () => {
          expect(gens.gen.next(walletInst).value).toEqual(
            apply(walletInst, walletInst.getAddressString)
          );
        });

        it('should put getFromSucceeded', () => {
          expect(gens.gen.next(fromAddress).value).toEqual(
            put(transactionNetworkActions.getFromSucceeded(fromAddress))
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
              types.TransactionActions.ETHER_TO_TOKEN_SWAP,
              types.TransactionActions.TOKEN_TO_TOKEN_SWAP,
              types.TransactionActions.TOKEN_TO_ETHER_SWAP,
              configMetaTypes.CONFIG_META.TOGGLE_AUTO_GAS_LIMIT
            ])
          );
        });

        it('should select getOffline', () => {
          expect(gen.next(action).value).toEqual(select(configMetaSelectors.getOffline));
        });

        it('should select autoGasLimitEnabled', () => {
          expect(gen.next(offline).value).toEqual(
            select(configMetaSelectors.getAutoGasLimitEnabled)
          );
        });

        it('should select getCurrentToAddressMessage', () => {
          expect(gen.next(autoGasLimitEnabled).value).toEqual(
            select(selectors.getCurrentToAddressMessage)
          );
        });

        it('should select getTransaction', () => {
          expect(gen.next(addressMessage).value).toEqual(select(selectors.getTransaction));
        });

        it('should call getTransactionFields with transaction', () => {
          expect(gen.next(tx).value).toEqual(call(getTransactionFields, transaction));
        });

        it('should put estimatedGasRequested with rest', () => {
          expect(gen.next(transactionFields).value).toEqual(
            put(transactionNetworkActions.estimateGasRequested(rest))
          );
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
            actionChannel(
              transactionNetworkTypes.TransactionNetworkActions.ESTIMATE_GAS_REQUESTED,
              buffers.sliding(1)
            )
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
            select(scheduleSelectors.isSchedulingEnabled)
          );
        });

        it('should put setGasLimitField', () => {
          gens.scheduleCase = gens.successCase.clone();
          const notScheduling = null as any;
          expect(gens.successCase.next(notScheduling).value).toEqual(
            put(transactionFieldsActions.setGasLimitField(gasSetOptions))
          );
        });

        it('should put setScheduleGasLimitField', () => {
          const scheduling = { value: true } as any;
          expect(gens.scheduleCase.next(scheduling).value).toEqual(
            put(scheduleActions.setScheduleGasLimitField(gasSetOptions))
          );
        });

        it('should put estimateGasSucceeded', () => {
          expect(gens.successCase.next().value).toEqual(
            put(transactionNetworkActions.estimateGasSucceeded())
          );
        });

        describe('when it times out', () => {
          it('should put estimateGasTimedout ', () => {
            expect(gens.timeOutCase.next(unsuccessfulGasEstimationResult).value).toEqual(
              put(transactionNetworkActions.estimateGasTimedout())
            );
          });
          it('should call localGasEstimation', () => {
            expect(
              gens.timeOutCase.next(transactionNetworkActions.estimateGasFailed()).value
            ).toEqual(call(sagas.localGasEstimation, payload));
          });
        });

        describe('when it throws', () => {
          it('should catch and put estimateGasFailed', () => {
            expect(gens.failCase.throw().value).toEqual(
              put(transactionNetworkActions.estimateGasFailed())
            );
          });

          it('should call localGasEstimation', () => {
            expect(gens.failCase.next(transactionNetworkActions.estimateGasFailed()).value).toEqual(
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
          expect(gen.next(true).value).toEqual(select(selectors.getCurrentToAddressMessage));
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
        const fromAddress = 'fromAddress';
        const retrievedNonce = '0xa';
        const base10Nonce = Nonce(retrievedNonce);

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
          expect(gens.noWallet.next(offline).done).toEqual(true);
        });

        it('should select getOffline', () => {
          expect(gens.gen.next(walletInst).value).toEqual(select(configMetaSelectors.getOffline));
        });

        it('should exit if being called while offline', () => {
          gens.offline = gens.gen.clone();
          expect(gens.offline.next(true).done).toEqual(true);
        });

        it('should apply walletInst.getAddressString', () => {
          expect(gens.gen.next(offline).value).toEqual(
            apply(walletInst, walletInst.getAddressString)
          );
        });

        it('should apply nodeLib.getTransactionCount', () => {
          expect(gens.gen.next(fromAddress).value).toEqual(
            apply(nodeLib, nodeLib.getTransactionCount, [fromAddress])
          );
        });

        it('should put inputNonce', () => {
          expect(gens.gen.next(retrievedNonce).value).toEqual(
            put(transactionFieldsActions.inputNonce(base10Nonce.toString()))
          );
        });

        it('should put getNonceSucceeded', () => {
          expect(gens.gen.next().value).toEqual(
            put(transactionNetworkActions.getNonceSucceeded(retrievedNonce))
          );
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
  describe('Sign', () => {
    describe('signLocalTransactionHandler*', () => {
      const tx = 'tx';
      const wallet = {
        signRawTransaction: jest.fn()
      };
      const action: any = { tx, wallet };
      const signedTransaction = new Buffer('signedTransaction');
      const indexingHash = 'indexingHash';

      const gen = sagas.signLocalTransactionHandler(action);

      it('should apply wallet.signRawTransaction', () => {
        expect(gen.next().value).toEqual(apply(wallet, wallet.signRawTransaction, [tx]));
      });

      it('should call computeIndexingHash', () => {
        expect(gen.next(signedTransaction).value).toEqual(
          call(computeIndexingHash, signedTransaction)
        );
      });

      it('should put signLocalTransactionSucceeded', () => {
        expect(gen.next(indexingHash).value).toEqual(
          put(
            transactionSignActions.signLocalTransactionSucceeded({
              signedTransaction,
              indexingHash,
              noVerify: false
            })
          )
        );
      });

      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    });

    describe('signWeb3TransactionHandler*', () => {
      const tx = {
        serialize: jest.fn
      };
      const action: any = { tx };
      const serializedTransaction = new Buffer('tx');
      const indexingHash = 'indexingHash';

      const gen = sagas.signWeb3TransactionHandler(action);

      it('should apply tx.serialize', () => {
        expect(gen.next().value).toEqual(apply(tx, tx.serialize));
      });

      it('should call computeIndexingHash', () => {
        expect(gen.next(serializedTransaction).value).toEqual(
          call(computeIndexingHash, serializedTransaction)
        );
      });

      it('should put signWeb3TransactionSucceeded', () => {
        expect(gen.next(indexingHash).value).toEqual(
          put(
            transactionSignActions.signWeb3TransactionSucceeded({
              transaction: serializedTransaction,
              indexingHash
            })
          )
        );
      });

      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    });
  });
  describe('Signing', () => {
    describe('signLocalTransactionHandler*', () => {
      const tx = 'tx';
      const wallet = {
        signRawTransaction: jest.fn()
      };
      const action: any = { tx, wallet };
      const signedTransaction = new Buffer('signedTransaction');
      const indexingHash = 'indexingHash';

      const gen = sagas.signLocalTransactionHandler(action);

      it('should apply wallet.signRawTransaction', () => {
        expect(gen.next().value).toEqual(apply(wallet, wallet.signRawTransaction, [tx]));
      });

      it('should call computeIndexingHash', () => {
        expect(gen.next(signedTransaction).value).toEqual(
          call(computeIndexingHash, signedTransaction)
        );
      });

      it('should put signLocalTransactionSucceeded', () => {
        expect(gen.next(indexingHash).value).toEqual(
          put(
            transactionSignActions.signLocalTransactionSucceeded({
              signedTransaction,
              indexingHash,
              noVerify: false
            })
          )
        );
      });

      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    });

    describe('signWeb3TransactionHandler*', () => {
      const tx = {
        serialize: jest.fn
      };
      const action: any = { tx };
      const serializedTransaction = new Buffer('tx');
      const indexingHash = 'indexingHash';

      const gen = sagas.signWeb3TransactionHandler(action);

      it('should apply tx.serialize', () => {
        expect(gen.next().value).toEqual(apply(tx, tx.serialize));
      });

      it('should call computeIndexingHash', () => {
        expect(gen.next(serializedTransaction).value).toEqual(
          call(computeIndexingHash, serializedTransaction)
        );
      });

      it('should put signWeb3TransactionSucceeded', () => {
        expect(gen.next(indexingHash).value).toEqual(
          put(
            transactionSignActions.signWeb3TransactionSucceeded({
              transaction: serializedTransaction,
              indexingHash
            })
          )
        );
      });

      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    });
  });
  describe('Reset', () => {
    describe('resetTransactionState*', () => {
      const gen = sagas.resetTransactionState();

      it('should check if this is a contract interaction tab', () => {
        expect(gen.next().value).toEqual(select(transactionMetaSelectors.isContractInteraction));
      });
      it('should put resetActionCreator', () => {
        expect(gen.next(false).value).toEqual(
          put(transactionFieldsActions.resetTransactionSuccessful({ isContractInteraction: false }))
        );
      });

      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    });
  });
  describe('Send Everything', () => {
    describe('handleSendEverything*', () => {
      let random: () => number;
      beforeAll(() => {
        random = Math.random;
        Math.random = () => 0.001;
      });

      afterAll(() => {
        Math.random = random;
      });

      const sharedStart = (gen: SagaIterator, transactionObj: any, currentBalance: BN | null) => {
        it('should select getTransaction', () => {
          expect(gen.next().value).toEqual(select(selectors.getTransaction));
        });

        it('should select getCurrentBalance', () => {
          expect(gen.next(transactionObj).value).toEqual(select(selectors.getCurrentBalance));
        });

        it('should select getEtherBalance', () => {
          expect(gen.next(currentBalance).value).toEqual(select(walletSelectors.getEtherBalance));
        });
      };

      describe('!etherBalance', () => {
        const transactionObj = {
          transaction: 'transaction'
        };
        const currentBalance = Wei('100');
        const etherBalance = null;
        const gen = sagas.handleSendEverything();

        sharedStart(gen, transactionObj, currentBalance);

        it('should put sendEverythingFailed', () => {
          expect(gen.next(etherBalance).value).toEqual(put(actions.sendEverythingFailed()));
        });
      });

      describe('!currentBalance', () => {
        const transactionObj = {
          transaction: 'transaction'
        };
        const currentBalance = null;
        const etherBalance = Wei('100');
        const gen = sagas.handleSendEverything();

        sharedStart(gen, transactionObj, currentBalance);

        it('should put sendEverythingFailed', () => {
          expect(gen.next(etherBalance).value).toEqual(put(actions.sendEverythingFailed()));
        });
      });

      describe('etherBalance && currentBalance', () => {
        const transaction = {
          getUpfrontCost: jest.fn()
        };
        const transactionObj = { transaction };
        const currentBalance = Wei('100');
        const etherBalance = Wei('100');
        const etherTransaction = true;

        const gens: any = {};
        gens.gen = cloneableGenerator(sagas.handleSendEverything)();
        gens.clone1 = {};
        gens.clone2 = {};

        sharedStart(gens.gen, transactionObj, currentBalance);

        it('should select isEtherTransaction', () => {
          expect(gens.gen.next(etherBalance).value).toEqual(select(selectors.isEtherTransaction));
        });

        it('should apply transaction.getUpfrontCost', () => {
          gens.clone2 = gens.gen.clone();
          expect(gens.gen.next(etherTransaction).value).toEqual(
            apply(transaction, transaction.getUpfrontCost)
          );
          gens.clone1 = gens.gen.clone();
        });

        describe('if totalCost > etherBalance', () => {
          const totalCost = Wei('1000');

          it('should put showNotification', () => {
            expect(gens.clone1.next(totalCost).value).toEqual(
              put(
                notificationsActions.showNotification(
                  'warning',
                  `The cost of gas is higher than your balance. Total cost: ${totalCost} >  Your Ether balance: ${etherBalance}`
                )
              )
            );
          });

          it('should put sendEverythingFailed', () => {
            expect(gens.clone1.next().value).toEqual(put(actions.sendEverythingFailed()));
          });

          it('should put setValueField', () => {
            expect(gens.clone1.next().value).toEqual(
              put(transactionFieldsActions.setValueField({ raw: '0', value: null }))
            );
          });

          it('should be done', () => {
            expect(gens.clone1.next().done).toEqual(true);
          });
        });

        describe('if etherTransaction', () => {
          const totalCost = Wei('10');
          const remainder = currentBalance.sub(totalCost);
          const rawVersion = fromWei(remainder, 'ether');

          it('should put setValueField', () => {
            expect(gens.gen.next(totalCost).value).toEqual(
              put(
                transactionFieldsActions.setValueField({
                  raw: rawVersion,
                  value: remainder
                })
              )
            );
          });

          it('should put sendEverythingSucceeded', () => {
            expect(gens.gen.next().value).toEqual(put(actions.sendEverythingSucceeded()));
          });

          it('should be done', () => {
            expect(gens.gen.next().done).toEqual(true);
          });
        });

        describe('if !etherTransaction (a token tx)', () => {
          const totalCostLocal = Wei('1');
          const etherTransactionLocal = false;
          const decimal = 3;
          const rawVersion = fromTokenBase(currentBalance, decimal);

          it('should apply transaction.getUpfrontCost', () => {
            expect(gens.clone2.next(etherTransactionLocal).value).toEqual(
              apply(transaction, transaction.getUpfrontCost)
            );
          });

          it('should select getDecimal', () => {
            expect(gens.clone2.next(totalCostLocal).value).toEqual(
              select(transactionMetaSelectors.getDecimal)
            );
          });

          it('should put setTokenValue', () => {
            expect(gens.clone2.next(decimal).value).toEqual(
              put(transactionMetaActions.setTokenValue({ raw: rawVersion, value: currentBalance }))
            );
          });

          it('should put sendEverythingSucceeded', () => {
            expect(gens.clone2.next().value).toEqual(put(actions.sendEverythingSucceeded()));
          });

          it('should be done', () => {
            expect(gens.clone2.next().done).toEqual(true);
          });
        });
      });
    });
  });
});
