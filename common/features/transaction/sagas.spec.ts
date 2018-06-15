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
import BN from 'bn.js';
import { bufferToHex, toBuffer } from 'ethereumjs-util';

import {
  Address,
  toTokenBase,
  Data,
  Wei,
  Nonce,
  gasPriceToBase,
  fromTokenBase,
  fromWei
} from 'libs/units';
import {
  encodeTransfer,
  computeIndexingHash,
  makeTransaction,
  getTransactionFields
} from 'libs/transaction';
import {
  isValidETHAddress,
  isValidENSAddress,
  isValidHex,
  isValidNonce,
  gasPriceValidator,
  gasLimitValidator
} from 'libs/validators';
import configuredStore from 'features/store';
import { CONFIG_META } from 'features/config/meta/types';
import { getOffline, getAutoGasLimitEnabled } from 'features/config/meta/selectors';
import { getNodeLib } from 'features/config/nodes/selectors';
import { isNetworkUnit } from 'features/config/selectors';
import * as ensTypes from 'features/ens/types';
import { resolveDomainRequested } from 'features/ens/actions';
import { getResolvedAddress } from 'features/ens/selectors';
import { WALLET } from 'features/wallet/types';
import {
  getWalletInst,
  getToken,
  getEtherBalance,
  getCurrentBalance
} from 'features/wallet/selectors';
import { setSchedulingToggle, setScheduleGasLimitField } from 'features/schedule/actions';
import { isSchedulingEnabled } from 'features/schedule/selectors';
import { showNotification } from 'features/notifications/actions';
import { TRANSACTION_FIELDS } from './fields/types';
import {
  setToField,
  setValueField,
  inputGasPrice,
  setDataField,
  setGasLimitField,
  setGasPriceField,
  setNonceField,
  inputNonce,
  resetTransactionSuccessful
} from './fields/actions';
import { getTo, getData, getValue } from './fields/selectors';
import { setTokenTo, setTokenValue } from './meta/actions';
import { getDecimal, getTokenValue, getTokenTo, isContractInteraction } from './meta/selectors';
import { TRANSACTION_NETWORK } from './network/types';
import {
  getFromSucceeded,
  getFromFailed,
  estimateGasFailed,
  estimateGasSucceeded,
  estimateGasRequested,
  estimateGasTimedout,
  getNonceSucceeded
} from './network/actions';
import { signLocalTransactionSucceeded, signWeb3TransactionSucceeded } from './sign/actions';
import { TRANSACTION } from './types';
import {
  swapEtherToToken,
  swapTokenToToken,
  sendEverythingSucceeded,
  sendEverythingFailed,
  swapTokenToEther
} from './actions';
import {
  isEtherTransaction,
  getUnit,
  getCurrentValue,
  getPreviousUnit,
  getDecimalFromUnit,
  getTransaction,
  getCurrentToAddressMessage
} from './selectors';
import {
  broadcastLocalTransactionHandler,
  broadcastWeb3TransactionHandler,
  setCurrentToSaga,
  setField,
  setCurrentValueSaga,
  revalidateCurrentValue,
  reparseCurrentValue,
  valueHandler,
  handleDataInput,
  handleGasLimitInput,
  handleNonceInput,
  handleGasPriceInput,
  handleGasPriceInputIntent,
  handleTokenTo,
  handleTokenValue,
  handleSetUnitMeta,
  handleFromRequest,
  signLocalTransactionHandler,
  signWeb3TransactionHandler,
  shouldEstimateGas,
  estimateGas,
  localGasEstimation,
  setAddressMessageGasLimit,
  handleNonceRequest,
  handleNonceRequestWrapper,
  resetTransactionState,
  handleSendEverything
} from './sagas';
import { validateInput, rebaseUserInput } from './helpers';

/* tslint:disable */
import './selectors'; //throws if not imported
import Web3Wallet from 'libs/wallet/non-deterministic/web3';
/* tslint:enable */

configuredStore.getState();

describe('transaction: Sagas', () => {
  describe('Broadcast', () => {
    describe('broadcastLocalTransactionHandler*', () => {
      const signedTx = 'signedTx';
      const node: any = {
        sendRawTx: jest.fn()
      };
      const txHash = 'txHash';

      const gen = broadcastLocalTransactionHandler(signedTx);

      it('should select getNodeLib', () => {
        expect(gen.next().value).toEqual(select(getNodeLib));
      });

      it('should apply node.sendRawTx', () => {
        expect(gen.next(node).value).toEqual(apply(node, node.sendRawTx, [signedTx]));
      });

      it('should return txHash', () => {
        expect(gen.next(txHash).value).toEqual(txHash);
      });

      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    });

    describe('broadcastWeb3TransactionHandler*', () => {
      const tx = 'tx';
      const notWeb3Wallet = false;
      const web3Wallet = new Web3Wallet('', '');
      const txHash = 'txHash';
      const nodeLib = { getNetVersion: () => 'ETH' };
      const netId = 'ETH';
      const networkConfig = { id: 'ETH' };

      const gens: any = {};
      gens.gen = cloneableGenerator(broadcastWeb3TransactionHandler)(tx);

      it('should select getWalletInst', () => {
        expect(gens.gen.next().value).toEqual(select(getWalletInst));
      });

      it('should throw if not a web3 wallet', () => {
        gens.clone1 = gens.gen.clone();
        expect(() => gens.clone1.next(notWeb3Wallet)).toThrow();
      });

      it('should apply wallet.sendTransaction', () => {
        gens.gen.next(web3Wallet);
        gens.gen.next(nodeLib);
        gens.gen.next(netId);
        expect(gens.gen.next(networkConfig).value).toEqual(
          apply(web3Wallet as any, web3Wallet.sendTransaction as any, [tx, nodeLib, networkConfig])
        );
      });

      it('should return txHash', () => {
        expect(gens.gen.next(txHash).value).toEqual(txHash);
      });

      it('should be done', () => {
        expect(gens.gen.next().done).toEqual(true);
      });
    });
  });
  describe('Current', () => {
    const itShouldBeDone = (gen: SagaIterator) => {
      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    };

    describe('setCurrentTo*', () => {
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

        data.validEthGen = setCurrentToSaga(ethAddrAction);
        it('should call isValidETHAddress', () => {
          expect(data.validEthGen.next().value).toEqual(call(isValidETHAddress, raw));
        });

        it('should call isValidENSAddress', () => {
          expect(data.validEthGen.next(raw).value).toEqual(call(isValidENSAddress, raw));
        });

        it('should call setField', () => {
          expect(data.validEthGen.next(raw).value).toEqual(call(setField, ethAddrPayload));
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
        data.validEnsGen = setCurrentToSaga(ensAddrAction);

        it('should call isValidETHAddress', () => {
          expect(data.validEnsGen.next().value).toEqual(call(isValidETHAddress, raw));
        });

        it('should call isValidENSAddress', () => {
          expect(data.validEnsGen.next(false).value).toEqual(call(isValidENSAddress, raw));
        });

        it('should call setField', () => {
          expect(data.validEnsGen.next(true).value).toEqual(call(setField, ensAddrPayload));
        });

        it('should put resolveDomainRequested', () => {
          expect(data.validEnsGen.next().value).toEqual(put(resolveDomainRequested(domain)));
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
          expect(data.validEnsGen.next().value).toEqual(select(getResolvedAddress, true));
        });

        it('should call setField', () => {
          expect(data.validEnsGen.next(resolvedAddress).value).toEqual(
            call(setField, { raw, value: Address(resolvedAddress) })
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
      const etherTransaction = cloneableGenerator(setField)(payload);
      it('should select etherTransaction', () => {
        expect(etherTransaction.next().value).toEqual(select(isEtherTransaction));
      });

      it('should put setTokenTo field if its a token transaction ', () => {
        const tokenTransaction = etherTransaction.clone();

        expect(tokenTransaction.next(false).value).toEqual(put(setTokenTo(payload)));
        expect(tokenTransaction.next().done).toBe(true);
      });
      it('should put setToField if its an etherTransaction', () => {
        expect(etherTransaction.next(true).value).toEqual(put(setToField(payload)));
        expect(etherTransaction.next().done).toBe(true);
      });
    });

    describe('valueHandler', () => {
      const action: any = { payload: '5.1' };
      const zeroAction: any = { payload: '0' };
      const setter = setValueField;
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
          setter: setTokenValue
        }
      };

      gen.pass = cloneableGenerator(valueHandler)(action, setter);
      gen.zeroPass = cloneableGenerator(valueHandler)(zeroAction, setter);
      gen.invalidNumber = cloneableGenerator(valueHandler)(
        failCases.invalidNumber.action as any,
        setter
      );
      gen.invalidZeroToken = cloneableGenerator(valueHandler)(zeroAction, setTokenValue);
      const value = toTokenBase(action.payload, decimal);
      const zeroValue = toTokenBase(zeroAction.payload, decimal);
      const unit = 'eth';
      const isEth = true;

      it('should select getDecimal', () => {
        expect(gen.pass.next().value).toEqual(select(getDecimal));
        expect(gen.zeroPass.next().value).toEqual(select(getDecimal));
        expect(gen.invalidNumber.next().value).toEqual(select(getDecimal));
        expect(gen.invalidZeroToken.next().value).toEqual(select(getDecimal));
      });

      it('should select getUnit', () => {
        gen.invalidDecimal = gen.pass.clone();
        expect(gen.pass.next(decimal).value).toEqual(select(getUnit));
        expect(gen.zeroPass.next(decimal).value).toEqual(select(getUnit));
        expect(gen.invalidNumber.next(decimal).value).toEqual(select(getUnit));
        expect(gen.invalidDecimal.next(failCases.invalidDecimal).value).toEqual(select(getUnit));
        expect(gen.invalidZeroToken.next(decimal).value).toEqual(select(getUnit));
      });

      it('should select isEtherTransaction', () => {
        expect(gen.pass.next(unit).value).toEqual(select(isEtherTransaction));
        expect(gen.zeroPass.next(unit).value).toEqual(select(isEtherTransaction));
        expect(gen.invalidNumber.next(unit).value).toEqual(select(isEtherTransaction));
        expect(gen.invalidDecimal.next(unit).value).toEqual(select(isEtherTransaction));
        expect(gen.invalidZeroToken.next(failCases.invalidZeroToken.unit).value).toEqual(
          select(isEtherTransaction)
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
        expect(gen.pass.next(isEth).value).toEqual(call(validateInput, value, unit));
        expect(gen.zeroPass.next(isEth).value).toEqual(call(validateInput, zeroValue, unit));
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
        const g = cloneableGenerator(valueHandler)(leadZeroValue.action as any, setter);

        expect(g.next().value).toEqual(select(getDecimal));
        expect(g.next(leadZeroValue.decimal).value).toEqual(select(getUnit));
        expect(g.next(unit).value).toEqual(select(isEtherTransaction));
        expect(g.next(isEth).value).not.toEqual(
          put(setter({ raw: leadZeroValue.action.payload, value: null }))
        );
      });

      itShouldBeDone(gen.pass);
      itShouldBeDone(gen.zeroPass);
    });

    describe('setCurrentValue*', () => {
      const action: any = { payload: '5' };
      const gen = setCurrentValueSaga(action);
      it('should select isEtherTransaction', () => {
        expect(gen.next().value).toEqual(select(isEtherTransaction));
      });
      it('should call valueHandler', () => {
        expect(gen.next(isEtherTransaction).value).toEqual(
          call(valueHandler, action, setValueField)
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
          expect(gen.next().value).toEqual(select(isEtherTransaction));
        });

        it('should select getCurrentValue', () => {
          expect(gen.next(etherTransaction).value).toEqual(select(getCurrentValue));
        });

        it('should call reparseCurrentValue', () => {
          expect(gen.next(currVal).value).toEqual(call(reparseCurrentValue, currVal));
        });

        it('should select getUnit', () => {
          expect(gen.next(reparsedValue).value).toEqual(select(getUnit));
        });
      };

      describe('when !reparsedValue', () => {
        const etherTransaction = false;
        const currVal = {
          raw: 'raw1'
        };
        const reparsedValue = false;
        const gen = revalidateCurrentValue();

        sharedLogic(gen, etherTransaction, currVal, reparsedValue);

        it('should put with setTokenValue', () => {
          expect(gen.next().value).toEqual(
            put(
              setTokenValue({
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
        const gen = revalidateCurrentValue();
        sharedLogic(gen, etherTransaction, currVal, reparsedValue);

        it('should call validateInput', () => {
          expect(gen.next(unit).value).toEqual(call(validateInput, reparsedValue.value, unit));
        });

        it('should put setValueField', () => {
          expect(gen.next(isValid).value).toEqual(
            put(
              setValueField({
                raw: reparsedValue.raw,
                value: reparsedValue.value
              } as any)
            )
          );
        });

        itShouldBeDone(gen);
      });
    });

    describe('reparseCurrentValue*', () => {
      const decimal = 5;

      const sharedLogic = (gen: SagaIterator, isEth: boolean) => {
        it('should select isEtherTransaction', () => {
          expect(gen.next().value).toEqual(select(isEtherTransaction));
        });

        it('should select getDecimal', () => {
          expect(gen.next(isEth).value).toEqual(select(getDecimal));
        });
      };

      describe('when eth tx value is positive number and valid decimal', () => {
        const value: any = {
          raw: '100.0000'
        };
        const gen = reparseCurrentValue(value);

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
        const gen = reparseCurrentValue(value);

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
        const gen = reparseCurrentValue(value);

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
        const gen = reparseCurrentValue(value);

        sharedLogic(gen, false);

        it('should return null', () => {
          expect(gen.next(decimal).value).toEqual(null);
        });

        itShouldBeDone(gen);
      });
    });
  });
  describe('Fields', () => {
    const itShouldBeDone = (gen: SagaIterator) => {
      it('should be done', () => {
        expect(gen.next().done).toEqual(true);
      });
    };

    describe('handleDataInput*', () => {
      const payload = 'payload';
      const action: any = { payload };
      const validData = true;

      const gens: any = {};
      gens.gen = cloneableGenerator(handleDataInput)(action);

      it('should put call isValidHex with payload', () => {
        expect(gens.gen.next().value).toEqual(call(isValidHex, payload));
      });

      it('should put setDataField with null value when data is invalid', () => {
        gens.clone = gens.gen.clone();
        expect(gens.clone.next(!validData).value).toEqual(
          put(
            setDataField({
              raw: payload,
              value: null
            })
          )
        );
      });

      it('should put setDataField with parsed value', () => {
        expect(gens.gen.next(validData).value).toEqual(
          put(
            setDataField({
              raw: payload,
              value: Data(payload)
            })
          )
        );
      });

      itShouldBeDone(gens.gen);
    });

    describe('handleGasLimitInput*', () => {
      const payload = '100.111';
      const action: any = { payload };

      const gens: any = {};
      gens.gen = cloneableGenerator(handleGasLimitInput)(action);

      it('should call gasLimitValidator', () => {
        expect(gens.gen.next().value).toEqual(call(gasLimitValidator, payload));
      });

      it('should put setGasLimitField with null value when payload is invalid', () => {
        gens.gen.invalid = gens.gen.clone();
        expect(gens.gen.invalid.next(false).value).toEqual(
          put(
            setGasLimitField({
              raw: payload,
              value: null
            })
          )
        );
      });

      it('should put setGasLimitField with Wei value', () => {
        gens.gen.valid = gens.gen.clone();
        expect(gens.gen.valid.next(true).value).toEqual(
          put(
            setGasLimitField({
              raw: payload,
              value: Wei(payload)
            })
          )
        );
      });

      it('should be done', () => {
        expect(gens.gen.invalid.next().done).toEqual(true);
        expect(gens.gen.valid.next().done).toEqual(true);
      });
    });

    describe('handleGasPriceInput*', () => {
      const payload = '100.111';
      const action: any = { payload };
      const priceFloat = parseFloat(payload);

      const gens: any = {};
      gens.gen = cloneableGenerator(handleGasPriceInput)(action);

      it('should call gasPriceValidator', () => {
        expect(gens.gen.next().value).toEqual(call(gasPriceValidator, priceFloat));
      });

      it('should put setGasPriceField with 0 value when payload is invalid', () => {
        gens.gen.invalid = gens.gen.clone();
        expect(gens.gen.invalid.next(false).value).toEqual(
          put(
            setGasPriceField({
              raw: payload,
              value: new BN(0)
            })
          )
        );
      });

      it('should put setGasPriceField with base gas price value', () => {
        gens.gen.valid = gens.gen.clone();
        expect(gens.gen.valid.next(true).value).toEqual(
          put(
            setGasPriceField({
              raw: payload,
              value: gasPriceToBase(priceFloat)
            })
          )
        );
      });

      it('should be done', () => {
        expect(gens.gen.invalid.next().done).toEqual(true);
        expect(gens.gen.valid.next().done).toEqual(true);
      });
    });

    describe('handleGasPriceInputIntent*', () => {
      const payload = '100.111';
      const action: any = { payload };
      const gen = handleGasPriceInputIntent(action);
      it('should call delay', () => {
        expect(gen.next().value).toEqual(call(delay, 300));
      });

      it('should put inputGasPrice', () => {
        expect(gen.next().value).toEqual(put(inputGasPrice(payload)));
      });
    });

    describe('handleNonceInput*', () => {
      const payload = '42';
      const action: any = { payload };
      const validNonce = true;

      const gens: any = {};
      gens.gen = cloneableGenerator(handleNonceInput)(action);

      it('should put call isValidNonce with payload', () => {
        expect(gens.gen.next().value).toEqual(call(isValidNonce, payload));
      });

      it('should put setDataField with null value when data is invalid', () => {
        gens.clone = gens.gen.clone();
        expect(gens.clone.next(!validNonce).value).toEqual(
          put(
            setNonceField({
              raw: payload,
              value: null
            })
          )
        );
      });

      it('should put setDataField with parsed value', () => {
        expect(gens.gen.next(validNonce).value).toEqual(
          put(
            setNonceField({
              raw: payload,
              value: Nonce(payload)
            })
          )
        );
      });

      itShouldBeDone(gens.gen);
    });
  });
  describe('Meta', () => {
    describe('Token', () => {
      configuredStore.getState();

      const itShouldBeDone = (gen: SagaIterator) => {
        it('should be done', () => {
          expect(gen.next().done).toEqual(true);
        });
      };

      describe('handleTokenTo*', () => {
        const action: any = {
          payload: {
            value: 'value1'
          }
        };
        const tokenValue: any = {
          value: 'value2'
        };
        const data: any = 'data';

        const gens: any = {};
        gens.gen = cloneableGenerator(handleTokenTo)(action);

        it('should select getTokenValue', () => {
          expect(gens.gen.next().value).toEqual(select(getTokenValue));
        });

        it('should return if !tokenValue.value', () => {
          gens.clone1 = gens.gen.clone();
          expect(gens.clone1.next({ value: false }).done).toEqual(true);
        });

        it('should call encodeTransfer', () => {
          expect(gens.gen.next(tokenValue).value).toEqual(
            call(encodeTransfer, action.payload.value, tokenValue.value)
          );
        });

        it('should put setDataField', () => {
          expect(gens.gen.next(data).value).toEqual(
            put(
              setDataField({
                raw: bufferToHex(data),
                value: data
              })
            )
          );
        });

        itShouldBeDone(gens.gen);
      });

      describe('handleTokenValue*', () => {
        const action: any = {
          payload: {
            value: 'value1'
          }
        };
        const tokenTo: any = {
          value: 'value2'
        };
        const data: any = toBuffer('0x0a');
        const prevData: any = {
          raw: '0x0b'
        };

        const gens: any = {};
        gens.gen = cloneableGenerator(handleTokenValue)(action);

        it('should select getTokenTo', () => {
          expect(gens.gen.next().value).toEqual(select(getTokenTo));
        });

        it('should select getData', () => {
          gens.clone1 = gens.gen.clone();
          expect(gens.gen.next(tokenTo).value).toEqual(select(getData));
        });

        it('should return if !tokenTo.value', () => {
          gens.clone1.next({ value: false });
          expect(gens.clone1.next().done).toEqual(true);
        });

        it('should call encodeTransfer', () => {
          expect(gens.gen.next(prevData).value).toEqual(
            call(encodeTransfer, tokenTo.value, action.payload.value)
          );
        });

        it('should put setDataField', () => {
          gens.clone2 = gens.gen.clone();
          expect(gens.gen.next(data).value).toEqual(
            put(setDataField({ raw: bufferToHex(data), value: data }))
          );
        });

        it('should return if prevData is equal to data', () => {
          const sameData = toBuffer('0xb');
          expect(gens.clone2.next(sameData).done).toEqual(true);
        });

        itShouldBeDone(gens.gen);
      });
    });

    describe('Unit Swap', () => {
      const itShouldBeDone = (gen: SagaIterator) => {
        it('should be done', () => {
          expect(gen.next().done).toEqual(true);
        });
      };

      describe('handleSetUnitMeta*', () => {
        const expectedStart = (
          gen: SagaIterator,
          previousUnit: string,
          currentUnit: string,
          prevUnitIsNetworkUnit: boolean,
          currUnitIsNetworkUnit: boolean
        ) => {
          it('should select getPreviousUnit', () => {
            expect(gen.next().value).toEqual(select(getPreviousUnit));
          });

          it('should check if prevUnit is a network unit', () => {
            expect(gen.next(previousUnit).value).toEqual(select(isNetworkUnit, previousUnit));
          });

          it('should check if currUnit is a network unit', () => {
            expect(gen.next(prevUnitIsNetworkUnit).value).toEqual(
              select(isNetworkUnit, currentUnit)
            );
          });

          it('should select getDeciimalFromUnit with currentUnit', () => {
            expect(gen.next(currUnitIsNetworkUnit).value).toEqual(
              select(getDecimalFromUnit, currentUnit)
            );
          });
        };

        describe('etherToEther', () => {
          const currentUnit = 'ETH';
          const previousUnit = 'ETH';
          const action: any = {
            payload: currentUnit
          };
          const gen = handleSetUnitMeta(action);

          expectedStart(gen, previousUnit, currentUnit, true, true);

          it('should return correctly', () => {
            expect(gen.next().value).toEqual(undefined);
          });

          itShouldBeDone(gen);
        });

        describe('tokenToEther', () => {
          const previousUnit = 'token';
          const currentUnit = 'ETH';
          const action: any = {
            payload: currentUnit
          };
          const decimal = 1;
          const tokenTo: any = 'tokenTo';
          const tokenValue: any = 'tokenValue';
          const raw = 'raw';
          const value: any = 'value';
          const gen = handleSetUnitMeta(action);

          expectedStart(gen, previousUnit, currentUnit, false, true);

          it('should select getTokenTo', () => {
            expect(gen.next(decimal).value).toEqual(select(getTokenTo));
          });

          it('should select getTokenValue', () => {
            expect(gen.next(tokenTo).value).toEqual(select(getTokenValue));
          });

          it('should call rebaseUserInput with tokenValue', () => {
            expect(gen.next(tokenValue).value).toEqual(call(rebaseUserInput, tokenValue));
          });

          it('should call validateInput with value and currentUnit', () => {
            expect(gen.next({ value, raw }).value).toEqual(call(validateInput, value, currentUnit));
          });

          it('should put swapTokenToEther', () => {
            expect(gen.next(true).value).toEqual(
              put(
                swapTokenToEther({
                  to: tokenTo,
                  value: {
                    raw,
                    value
                  },
                  decimal
                } as any)
              )
            );
          });

          itShouldBeDone(gen);
        });

        describe('etherToToken || tokenToToken', () => {
          const sharedLogicA = (gen: SagaIteratorClone, decimal: number, currentUnit: string) => {
            it('should select getToken with currentUnit', () => {
              expect(gen.next(decimal).value).toEqual(select(getToken, currentUnit));
            });

            it('should throw error if !currentToken', () => {
              const clone = gen.clone();
              expect(() => clone.next(false)).toThrowError('Could not find token during unit swap');
            });
          };

          const sharedLogicB = (
            gen: SagaIterator,
            input: string,
            raw: string,
            value: BN,
            currentUnit: string,
            isValid: boolean
          ) => {
            it('should call rebaseUserInput with input', () => {
              expect(gen.next(input).value).toEqual(call(rebaseUserInput, input as any));
            });

            it('should call validateInput with value and currentUnit', () => {
              expect(gen.next({ raw, value }).value).toEqual(
                call(validateInput, value, currentUnit)
              );
            });

            it('should select getTo', () => {
              expect(gen.next(isValid).value).toEqual(select(getTo));
            });
          };

          const constructExpectedPayload = (
            data: Buffer,
            toAddress: string,
            raw: string,
            value: BN,
            decimal: number,
            tokenTo?: any
          ) => {
            const base = {
              data: { raw: bufferToHex(data), value: data },
              to: { raw: '', value: Address(toAddress) },
              tokenValue: { raw, value },
              decimal
            };
            if (!tokenTo) {
              return base;
            }
            return {
              ...base,
              tokenTo
            };
          };

          describe('etherToToken', () => {
            const previousUnit = 'ETH';
            const currentUnit = 'token';
            const action: any = {
              payload: currentUnit
            };
            const currentToken = {
              address: '0x0'
            };
            const decimal = 1;
            const input = 'input';
            const raw = 'raw';
            const value = Wei('100');
            const isValid = true;
            const to = { value: value.toBuffer() };

            const gens: any = {};
            gens.gen = cloneableGenerator(handleSetUnitMeta)(action);

            expectedStart(gens.gen, previousUnit, currentUnit, true, false);

            sharedLogicA(gens.gen, decimal, currentUnit);

            it('should select getValue', () => {
              expect(gens.gen.next(currentToken).value).toEqual(select(getValue));
            });

            sharedLogicB(gens.gen, input, raw, value, currentUnit, isValid);

            it('should put setSchedulingToogle', () => {
              expect(gens.gen.next(to).value).toEqual(
                put(
                  setSchedulingToggle({
                    value: false
                  })
                )
              );
            });

            it('should put swapEtherToToken', () => {
              const data = encodeTransfer(to.value, value);
              const payload: any = constructExpectedPayload(
                data,
                currentToken.address,
                raw,
                value,
                decimal,
                to
              );

              expect(gens.gen.next(to).value).toEqual(put(swapEtherToToken(payload)));
            });

            itShouldBeDone(gens.gen);
          });

          describe('tokenToToken', () => {
            const previousUnit = 'token';
            const currentUnit = 'token';
            const action: any = {
              payload: currentUnit
            };
            const currentToken = {
              address: '0x1'
            };
            const decimal = 1;
            const input = 'input';
            const raw = 'raw';
            const value = Wei('100');
            const isValid = true;
            const to = { value: '0xa' };
            const tokenTo = { value: '0xb' };

            const gens: any = {};
            gens.gen = cloneableGenerator(handleSetUnitMeta)(action);

            expectedStart(gens.gen, previousUnit, currentUnit, false, false);

            sharedLogicA(gens.gen, decimal, currentUnit);

            it('should select getTokenValue', () => {
              expect(gens.gen.next(currentToken).value).toEqual(select(getTokenValue));
            });

            sharedLogicB(gens.gen, input, raw, value, currentUnit, isValid);

            it('should select getTokenTo', () => {
              expect(gens.gen.next(to).value).toEqual(select(getTokenTo));
            });

            it('should put swapEtherToToken', () => {
              const data = encodeTransfer(Address(tokenTo.value), value);
              const payload = constructExpectedPayload(
                data,
                currentToken.address,
                raw,
                value,
                decimal
              );
              expect(gens.gen.next(tokenTo).value).toEqual(put(swapTokenToToken(payload)));
            });

            itShouldBeDone(gens.gen);
          });
        });
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
        gens.gen = cloneableGenerator(handleFromRequest)();
        let random: () => number;

        beforeAll(() => {
          random = Math.random;
          Math.random = () => 0.001;
        });

        afterAll(() => {
          Math.random = random;
        });

        it('should select getWalletInst', () => {
          expect(gens.gen.next().value).toEqual(select(getWalletInst));
        });

        it('should handle errors as expected', () => {
          gens.clone = gens.gen.clone();
          expect(gens.clone.next(false).value).toEqual(
            put(showNotification('warning', 'Your wallets address could not be fetched'))
          );
          expect(gens.clone.next().value).toEqual(put(getFromFailed()));
          expect(gens.clone.next().done).toEqual(true);
        });

        it('should apply walletInst.getAddress', () => {
          expect(gens.gen.next(walletInst).value).toEqual(
            apply(walletInst, walletInst.getAddressString)
          );
        });

        it('should put getFromSucceeded', () => {
          expect(gens.gen.next(fromAddress).value).toEqual(put(getFromSucceeded(fromAddress)));
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
          type: TRANSACTION_FIELDS.TO_FIELD_SET,
          payload: {
            value: 'value',
            raw: 'raw'
          }
        };

        const gen = shouldEstimateGas();

        it('should take expected types', () => {
          expect(gen.next().value).toEqual(
            take([
              TRANSACTION_FIELDS.TO_FIELD_SET,
              TRANSACTION_FIELDS.DATA_FIELD_SET,
              TRANSACTION.ETHER_TO_TOKEN_SWAP,
              TRANSACTION.TOKEN_TO_TOKEN_SWAP,
              TRANSACTION.TOKEN_TO_ETHER_SWAP,
              CONFIG_META.TOGGLE_AUTO_GAS_LIMIT
            ])
          );
        });

        it('should select getOffline', () => {
          expect(gen.next(action).value).toEqual(select(getOffline));
        });

        it('should select autoGasLimitEnabled', () => {
          expect(gen.next(offline).value).toEqual(select(getAutoGasLimitEnabled));
        });

        it('should select getCurrentToAddressMessage', () => {
          expect(gen.next(autoGasLimitEnabled).value).toEqual(select(getCurrentToAddressMessage));
        });

        it('should select getTransaction', () => {
          expect(gen.next(addressMessage).value).toEqual(select(getTransaction));
        });

        it('should call getTransactionFields with transaction', () => {
          expect(gen.next(tx).value).toEqual(call(getTransactionFields, transaction));
        });

        it('should put estimatedGasRequested with rest', () => {
          expect(gen.next(transactionFields).value).toEqual(put(estimateGasRequested(rest)));
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
        gens.successCase = cloneableGenerator(estimateGas)();

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
            actionChannel(TRANSACTION_NETWORK.ESTIMATE_GAS_REQUESTED, buffers.sliding(1))
          );
          const result = JSON.stringify(gens.successCase.next().value);
          expect(expected).toEqual(result);
        });

        it('should select autoGasLimit', () => {
          expect(gens.successCase.next(requestChan).value).toEqual(select(getAutoGasLimitEnabled));
        });

        it('should select getOffline', () => {
          expect(gens.successCase.next(autoGasLimitEnabled).value).toEqual(select(getOffline));
        });

        it('should take requestChan', () => {
          expect(gens.successCase.next(offline).value).toEqual(take(requestChan));
        });

        it('should call delay', () => {
          expect(gens.successCase.next(action).value).toEqual(call(delay, 250));
        });

        it('should select getNodeLib', () => {
          expect(gens.successCase.next().value).toEqual(select(getNodeLib));
        });

        it('should select getWalletInst', () => {
          expect(gens.successCase.next(node).value).toEqual(select(getWalletInst));
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

        it('should put setGasLimitField', () => {
          gens.scheduleCase = gens.successCase.clone();
          const notScheduling = null as any;
          expect(gens.successCase.next(notScheduling).value).toEqual(
            put(setGasLimitField(gasSetOptions))
          );
        });

        it('should put setScheduleGasLimitField', () => {
          const scheduling = { value: true } as any;
          expect(gens.scheduleCase.next(scheduling).value).toEqual(
            put(setScheduleGasLimitField(gasSetOptions))
          );
        });

        it('should put estimateGasSucceeded', () => {
          expect(gens.successCase.next().value).toEqual(put(estimateGasSucceeded()));
        });

        describe('when it times out', () => {
          it('should put estimateGasTimedout ', () => {
            expect(gens.timeOutCase.next(unsuccessfulGasEstimationResult).value).toEqual(
              put(estimateGasTimedout())
            );
          });
          it('should call localGasEstimation', () => {
            expect(gens.timeOutCase.next(estimateGasFailed()).value).toEqual(
              call(localGasEstimation, payload)
            );
          });
        });

        describe('when it throws', () => {
          it('should catch and put estimateGasFailed', () => {
            expect(gens.failCase.throw().value).toEqual(put(estimateGasFailed()));
          });

          it('should call localGasEstimation', () => {
            expect(gens.failCase.next(estimateGasFailed()).value).toEqual(
              call(localGasEstimation, payload)
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

        const gen = localGasEstimation(payload);
        it('should call makeTransaction with payload', () => {
          expect(gen.next().value).toEqual(call(makeTransaction, payload));
        });

        it('should apply tx.getBaseFee', () => {
          expect(gen.next(tx).value).toEqual(apply(tx, tx.getBaseFee));
        });

        it('should put setGasLimitField', () => {
          expect(gen.next(gasLimit).value).toEqual(
            put(
              setGasLimitField({
                raw: gasLimit.toString(),
                value: gasLimit
              })
            )
          );
        });
      });

      describe('setAddressMessageGasLimit*', () => {
        const gens = cloneableGenerator(setAddressMessageGasLimit)();
        const gen = gens.clone();
        let noAutoGen: SagaIteratorClone;
        let noMessageGen: SagaIteratorClone;
        const addressMessage = {
          gasLimit: 123456,
          msg: 'Thanks for donating, er, investing in SCAM'
        };

        it('should select getAutoGasLimitEnabled', () => {
          expect(gen.next().value).toEqual(select(getAutoGasLimitEnabled));
        });

        it('should select getCurrentToAddressMessage', () => {
          noAutoGen = gen.clone();
          expect(gen.next(true).value).toEqual(select(getCurrentToAddressMessage));
        });

        it('should put setGasLimitField', () => {
          noMessageGen = gen.clone();
          expect(gen.next(addressMessage).value).toEqual(
            put(
              setGasLimitField({
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
        gens.gen = cloneableGenerator(handleNonceRequest)();
        let random: () => number;

        beforeAll(() => {
          random = Math.random;
          Math.random = () => 0.001;
        });

        afterAll(() => {
          Math.random = random;
        });

        it('should select getNodeLib', () => {
          expect(gens.gen.next().value).toEqual(select(getNodeLib));
        });

        it('should select getWalletInstance', () => {
          expect(gens.gen.next(nodeLib).value).toEqual(select(getWalletInst));
        });

        it('should exit if being called without a wallet inst', () => {
          gens.noWallet = gens.gen.clone();
          gens.noWallet.next(null); // No wallet inst
          expect(gens.noWallet.next(offline).done).toEqual(true);
        });

        it('should select getOffline', () => {
          expect(gens.gen.next(walletInst).value).toEqual(select(getOffline));
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
            put(inputNonce(base10Nonce.toString()))
          );
        });

        it('should put getNonceSucceeded', () => {
          expect(gens.gen.next().value).toEqual(put(getNonceSucceeded(retrievedNonce)));
        });
      });

      describe('handleNonceRequestWrapper*', () => {
        const gen = handleNonceRequestWrapper();
        const nonceRequest = createMockTask();

        it('should fork handleNonceRequest', () => {
          expect(gen.next().value).toEqual(fork(handleNonceRequest));
        });

        it('should take on WALLET_SET', () => {
          expect(gen.next(nonceRequest).value).toEqual(take(WALLET.SET));
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

      const gen = signLocalTransactionHandler(action);

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
            signLocalTransactionSucceeded({
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

      const gen = signWeb3TransactionHandler(action);

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
            signWeb3TransactionSucceeded({
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

      const gen = signLocalTransactionHandler(action);

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
            signLocalTransactionSucceeded({
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

      const gen = signWeb3TransactionHandler(action);

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
            signWeb3TransactionSucceeded({
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
      const gen = resetTransactionState();

      it('should check if this is a contract interaction tab', () => {
        expect(gen.next().value).toEqual(select(isContractInteraction));
      });
      it('should put resetActionCreator', () => {
        expect(gen.next(false).value).toEqual(
          put(resetTransactionSuccessful({ isContractInteraction: false }))
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
          expect(gen.next().value).toEqual(select(getTransaction));
        });

        it('should select getCurrentBalance', () => {
          expect(gen.next(transactionObj).value).toEqual(select(getCurrentBalance));
        });

        it('should select getEtherBalance', () => {
          expect(gen.next(currentBalance).value).toEqual(select(getEtherBalance));
        });
      };

      describe('!etherBalance', () => {
        const transactionObj = {
          transaction: 'transaction'
        };
        const currentBalance = Wei('100');
        const etherBalance = null;
        const gen = handleSendEverything();

        sharedStart(gen, transactionObj, currentBalance);

        it('should put sendEverythingFailed', () => {
          expect(gen.next(etherBalance).value).toEqual(put(sendEverythingFailed()));
        });
      });

      describe('!currentBalance', () => {
        const transactionObj = {
          transaction: 'transaction'
        };
        const currentBalance = null;
        const etherBalance = Wei('100');
        const gen = handleSendEverything();

        sharedStart(gen, transactionObj, currentBalance);

        it('should put sendEverythingFailed', () => {
          expect(gen.next(etherBalance).value).toEqual(put(sendEverythingFailed()));
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
        gens.gen = cloneableGenerator(handleSendEverything)();
        gens.clone1 = {};
        gens.clone2 = {};

        sharedStart(gens.gen, transactionObj, currentBalance);

        it('should select isEtherTransaction', () => {
          expect(gens.gen.next(etherBalance).value).toEqual(select(isEtherTransaction));
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
                showNotification(
                  'warning',
                  `The cost of gas is higher than your balance. Total cost: ${totalCost} >  Your Ether balance: ${etherBalance}`
                )
              )
            );
          });

          it('should put sendEverythingFailed', () => {
            expect(gens.clone1.next().value).toEqual(put(sendEverythingFailed()));
          });

          it('should put setValueField', () => {
            expect(gens.clone1.next().value).toEqual(put(setValueField({ raw: '0', value: null })));
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
                setValueField({
                  raw: rawVersion,
                  value: remainder
                })
              )
            );
          });

          it('should put sendEverythingSucceeded', () => {
            expect(gens.gen.next().value).toEqual(put(sendEverythingSucceeded()));
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
            expect(gens.clone2.next(totalCostLocal).value).toEqual(select(getDecimal));
          });

          it('should put setTokenValue', () => {
            expect(gens.clone2.next(decimal).value).toEqual(
              put(setTokenValue({ raw: rawVersion, value: currentBalance }))
            );
          });

          it('should put sendEverythingSucceeded', () => {
            expect(gens.clone2.next().value).toEqual(put(sendEverythingSucceeded()));
          });

          it('should be done', () => {
            expect(gens.clone2.next().done).toEqual(true);
          });
        });
      });
    });
  });
});
