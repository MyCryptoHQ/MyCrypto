import { fAssets } from '@../jest_config/__fixtures__/assets';

import { fAccount, fAccounts, fERC20NonWeb3TxConfig, fNetwork, fSignedTx } from '@fixtures';
import { IFormikFields, ILegacyTxReceipt, ITxStatus, TxQueryTypes } from '@types';
import { inputGasLimitToHex, inputNonceToHex } from '@utils';

import { ReducerAction, sendAssetsReducer } from '../SendAssets.reducer';

const dispatch = (action: ReducerAction) => (state: any) => sendAssetsReducer(state, action);

const defaultTxConfig = {
  asset: fAssets[0],
  baseAsset: fAssets[0],
  amount: '1',
  rawTransaction: {
    value: '0x0de0b6b3a7640000',
    to: fAccount.address,
    gasPrice: '0x012a05f200',
    data: '0x00',
    gasLimit: '0x7d3c',
    nonce: '0x7',
    chainId: 3
  },
  from: fAccount.address,
  senderAccount: fAccount,
  receiverAddress: fAccount.address
};

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
        isAutoGasSet: true,
        maxFeePerGasField: '20',
        maxPriorityFeePerGasField: '1'
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
      expect(txConfig.networkId).toBe(form.network.id);
      expect(txConfig.baseAsset.uuid).toBe(fNetwork.baseAsset);
      expect(txConfig.rawTransaction.nonce).toBe(inputNonceToHex(form.nonceField));
      expect(txConfig.rawTransaction.gasLimit).toBe(inputGasLimitToHex(form.gasLimitField));

      expect(newState.signedTx).toBe(prevState.signedTx);
      expect(newState.txReceipt).toBe(prevState.txReceipt);
    });
  });
  describe('SIGN_SUCCESS', () => {
    it('updates txConfig and signedTx', () => {
      const prevState = {
        txReceipt: undefined,
        txConfig: { ...defaultTxConfig, asset: fAssets[1], baseAsset: fAssets[1] },
        signedTx: undefined
      };
      const payload = {
        signedTx: fSignedTx,
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
      expect(txConfig.receiverAddress).toBe(fAccounts[2].address);
      expect(txConfig.from).toBe('0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4');

      expect(newState.txReceipt).toBe(prevState.txReceipt);
    });
  });
  describe('WEB3_SIGN_SUCCESS', () => {
    it('updates the txReceipt with values from txConfig', () => {
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
      const txReceipt = newState.txReceipt! as ILegacyTxReceipt;
      expect(txReceipt.hash).toBe(payload);
      expect(txReceipt.amount).toBe(txConfig.amount);
      expect(txReceipt.asset.uuid).toBe(txConfig.asset.uuid);
      expect(txReceipt.baseAsset.uuid).toBe(txConfig.baseAsset.uuid);
      expect(txReceipt.data).toBe(txConfig.rawTransaction.data);
      expect(txReceipt.status).toBe(ITxStatus.PENDING);
      expect(txReceipt.to).toBe(fAccount.address);
      expect(txReceipt.from).toBe(fAccount.address);
      expect(txReceipt.gasLimit.toHexString()).toEqual(txConfig.rawTransaction.gasLimit);
      expect(txReceipt.gasPrice.toHexString()).toEqual(txConfig.rawTransaction.gasPrice);
      expect(txReceipt.value.toHexString()).toEqual(txConfig.rawTransaction.value);

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
    it('updates the txReceipt with values from txConfig', () => {
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
      const txReceipt = newState.txReceipt! as ILegacyTxReceipt;
      expect(txReceipt.hash).toBe(payload.hash);
      expect(txReceipt.amount).toBe(txConfig.amount);
      expect(txReceipt.asset.uuid).toBe(txConfig.asset.uuid);
      expect(txReceipt.baseAsset.uuid).toBe(txConfig.baseAsset.uuid);
      expect(txReceipt.data).toBe(txConfig.rawTransaction.data);
      expect(txReceipt.status).toBe(ITxStatus.PENDING);
      expect(txReceipt.to).toBe(fAccount.address);
      expect(txReceipt.from).toBe(fAccount.address);
      expect(txReceipt.gasLimit.toHexString()).toEqual(txConfig.rawTransaction.gasLimit);
      expect(txReceipt.gasPrice.toHexString()).toEqual(txConfig.rawTransaction.gasPrice);
      expect(txReceipt.value.toHexString()).toEqual(txConfig.rawTransaction.value);
      expect(newState.send).toBe(false);

      expect(newState.signedTx).toBe(prevState.signedTx);
      expect(newState.txConfig).toBe(prevState.txConfig);
    });
  });
  describe('SET_TXCONFIG', () => {
    it('sets the tx config, increments the txNumber by one and resets the remaining fields', () => {
      const prevState = {
        txReceipt: undefined,
        txConfig: defaultTxConfig,
        signedTx: '0x12345678',
        txNumber: 0
      };
      const inputTxConfig = fERC20NonWeb3TxConfig;
      const payload = { txConfig: inputTxConfig, txQueryType: TxQueryTypes.SPEEDUP };
      const newState = dispatch({
        type: sendAssetsReducer.actionTypes.SET_TXCONFIG,
        payload
      })(prevState);
      const { txConfig, txQueryType, txNumber } = newState!;

      expect(txConfig).toStrictEqual(inputTxConfig);
      expect(txQueryType).toBe(TxQueryTypes.SPEEDUP);
      expect(txNumber).toBe(prevState.txNumber + 1);
    });
  });
});
