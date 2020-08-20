import { IFormikFields, ITxStatus } from '@types';
import { fAssets } from '@../jest_config/__fixtures__/assets';
import { fAccount, fNetwork } from '@fixtures';
import { getDefaultEstimates, inputGasPriceToHex } from '@services';

import { sendAssetsReducer, ReducerAction } from '../SendAssets.reducer';

const dispatch = (action: ReducerAction) => (state: any) => sendAssetsReducer(state, action);

const defaultTxConfig = {
  asset: fAssets[0],
  baseAsset: fAssets[0],
  amount: '1',
  gasPrice: '57000000000',
  gasLimit: '21000',
  nonce: '10',
  data: '0x',
  rawTransaction: {
    value: '1',
    to: fAccount.address,
    gasPrice: '57000000000'
  },
  from: fAccount.address,
  senderAccount: fAccount,
  receiverAddress: fAccount.address
};

jest.mock('ethers/utils', () => {
  const { mockFactory } = require('../__mocks__/utils');
  // Uses a similar txConfig to defaultTxConfig, but can't use the same one due to import issues with Jest
  return mockFactory({
    gasPrice: '57000000000',
    gasLimit: '21000',
    nonce: '10',
    data: '0x',
    receiverAddress: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
    value: '10000000000000',
    to: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c'
  });
});

describe('SendAssetsReducer', () => {
  describe('FORM_SUBMIT', () => {
    it('can update txConfig with values', () => {
      const prevState = { txReceipt: undefined, signedTx: undefined };
      const form: IFormikFields = {
        asset: fAssets[0],
        address: { display: fAccount.address, value: fAccount.address },
        amount: '0.001',
        account: fAccount,
        txDataField: '',
        gasLimitField: '21000',
        gasPriceField: '60',
        gasPriceSlider: '80',
        network: fNetwork,
        nonceField: '10',
        advancedTransaction: false,
        gasEstimates: getDefaultEstimates(fNetwork),
        isAutoGasSet: true
      };

      const payload = { form, assets: fAssets };

      const newState = dispatch({ type: sendAssetsReducer.actionTypes.FORM_SUBMIT, payload })(
        prevState
      );
      const txConfig = newState.txConfig!;
      expect(txConfig.senderAccount.address).toBe(form.account.address);
      expect(txConfig.receiverAddress).toBe(form.address.value);
      expect(txConfig.amount).toBe(form.amount);
      expect(txConfig.asset.uuid).toBe(form.asset.uuid);
      expect(txConfig.network.id).toBe(form.network.id);
      expect(txConfig.baseAsset.uuid).toBe(fNetwork.baseAsset);
      expect(txConfig.nonce).toBe(form.nonceField);

      expect(newState.signedTx).toBe(prevState.signedTx);
      expect(newState.txReceipt).toBe(prevState.txReceipt);
    });
  });
  describe('SIGN_SUCCESS', () => {
    it('it updates txConfig and signedTx', () => {
      const prevState = {
        txReceipt: undefined,
        txConfig: defaultTxConfig,
        signedTx: undefined
      };
      const payload = {
        signedTx: '0x12345678',
        assets: fAssets,
        networks: [fNetwork],
        accounts: [fAccount]
      };
      const newState = dispatch({
        type: sendAssetsReducer.actionTypes.SIGN_SUCCESS,
        payload
      })(prevState);
      const txConfig = newState.txConfig!;
      const signedTx = newState.signedTx!;
      expect(signedTx).toBe(payload.signedTx);
      expect(txConfig.asset.uuid).toBe(prevState.txConfig.asset.uuid);
      expect(txConfig.baseAsset.uuid).toBe(prevState.txConfig.baseAsset.uuid);
      expect(txConfig.data).toBe(prevState.txConfig.data);
      expect(txConfig.receiverAddress).toBe(fAccount.address);
      expect(txConfig.from).toBe(fAccount.address);
      expect(txConfig.gasLimit).toEqual(prevState.txConfig.gasLimit);
      expect(txConfig.gasPrice).toEqual(prevState.txConfig.gasPrice);
      expect(txConfig.value).toEqual('10000000000000');

      expect(newState.txReceipt).toBe(prevState.txReceipt);
    });
  });
  describe('WEB3_SIGN_SUCCESS', () => {
    it('it updates the txReceipt with values from txConfig', () => {
      const prevState = {
        txReceipt: undefined,
        txConfig: defaultTxConfig,
        signedTx: undefined
      };
      const payload = '0x12345678';
      const newState = dispatch({
        type: sendAssetsReducer.actionTypes.WEB3_SIGN_SUCCESS,
        payload
      })(prevState);
      const txConfig = prevState.txConfig;
      const txReceipt = newState.txReceipt!;
      expect(txReceipt.hash).toBe(payload);
      expect(txReceipt.amount).toBe(txConfig.amount);
      expect(txReceipt.asset.uuid).toBe(txConfig.asset.uuid);
      expect(txReceipt.baseAsset.uuid).toBe(txConfig.baseAsset.uuid);
      expect(txReceipt.data).toBe(txConfig.data);
      expect(txReceipt.status).toBe(ITxStatus.PENDING);
      expect(txReceipt.to).toBe(fAccount.address);
      expect(txReceipt.from).toBe(fAccount.address);
      expect(txReceipt.gasLimit.toString()).toEqual(txConfig.gasLimit);
      expect(txReceipt.gasPrice.toString()).toEqual(txConfig.gasPrice);
      expect(txReceipt.value.toString()).toEqual(txConfig.rawTransaction.value);

      expect(newState.signedTx).toBe(prevState.signedTx);
      expect(newState.txConfig).toBe(prevState.txConfig);
    });
  });
  describe('REQUEST_SEND', () => {
    it('sets send to true and otherwise keeps the state as is', () => {
      const prevState = { txReceipt: undefined, txConfig: undefined, signedTx: undefined };
      const newState = dispatch({
        type: sendAssetsReducer.actionTypes.REQUEST_SEND,
        payload: undefined
      })(prevState);
      expect(newState.send).toBe(true);

      expect(newState.signedTx).toBe(prevState.signedTx);
      expect(newState.txReceipt).toBe(prevState.txReceipt);
      expect(newState.txConfig).toBe(prevState.txConfig);
    });
  });
  describe('SEND_SUCCESS', () => {
    it('it updates the txReceipt with values from txConfig', () => {
      const prevState = {
        txReceipt: undefined,
        txConfig: defaultTxConfig,
        signedTx: {}
      };
      const payload = { hash: '0x12345678' };
      const newState = dispatch({
        type: sendAssetsReducer.actionTypes.SEND_SUCCESS,
        payload
      })(prevState);
      const txConfig = prevState.txConfig;
      const txReceipt = newState.txReceipt!;
      expect(txReceipt.hash).toBe(payload.hash);
      expect(txReceipt.amount).toBe(txConfig.amount);
      expect(txReceipt.asset.uuid).toBe(txConfig.asset.uuid);
      expect(txReceipt.baseAsset.uuid).toBe(txConfig.baseAsset.uuid);
      expect(txReceipt.data).toBe(txConfig.data);
      expect(txReceipt.status).toBe(ITxStatus.PENDING);
      expect(txReceipt.to).toBe(fAccount.address);
      expect(txReceipt.from).toBe(fAccount.address);
      expect(txReceipt.gasLimit.toString()).toEqual(txConfig.gasLimit);
      expect(txReceipt.gasPrice.toString()).toEqual(txConfig.gasPrice);
      expect(txReceipt.value.toString()).toEqual(txConfig.rawTransaction.value);
      expect(newState.send).toBe(false);

      expect(newState.signedTx).toBe(prevState.signedTx);
      expect(newState.txConfig).toBe(prevState.txConfig);
    });
  });
  describe('REQUEST_RESUBMIT', () => {
    it('it updates the raw tx with a new gas price', () => {
      const prevState = {
        txReceipt: undefined,
        txConfig: defaultTxConfig,
        signedTx: undefined
      };
      const newState = dispatch({
        type: sendAssetsReducer.actionTypes.REQUEST_RESUBMIT,
        payload: undefined
      })(prevState);
      const txConfig = newState.txConfig;
      // Only the gas price should have changed
      expect(txConfig).toEqual({
        ...prevState.txConfig,
        rawTransaction: {
          ...prevState.txConfig.rawTransaction,
          gasPrice: inputGasPriceToHex('67')
        }
      });

      expect(newState.signedTx).toBe(prevState.signedTx);
      expect(newState.txReceipt).toBe(prevState.txReceipt);
    });
  });
});
