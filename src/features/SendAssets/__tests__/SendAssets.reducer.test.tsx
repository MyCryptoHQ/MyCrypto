import { IFormikFields } from '@types';
import { sendAssetsReducer } from '../SendAssets.reducer';
import { ReducerAction, ActionType } from '../types';
import { fAssets } from '@../jest_config/__fixtures__/assets';
import { fAccount, fNetwork } from '@fixtures';
import { getDefaultEstimates } from '@services';

const dispatch = (action: ReducerAction) => (state: any) => sendAssetsReducer(state, action);

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

      const newState = dispatch({ type: ActionType.FORM_SUBMIT, payload })(prevState);
      const txConfig = newState.txConfig!;
      expect(txConfig.senderAccount.address).toEqual(form.account.address);
      expect(txConfig.receiverAddress).toEqual(form.address.value);
      expect(txConfig.amount).toEqual(form.amount);
      expect(txConfig.asset.uuid).toEqual(form.asset.uuid);
      expect(txConfig.network.id).toEqual(form.network.id);
      expect(txConfig.baseAsset.uuid).toEqual(fNetwork.baseAsset);
      expect(txConfig.nonce).toEqual(form.nonceField);

      expect(newState.signedTx).toEqual(prevState.signedTx);
      expect(newState.txReceipt).toEqual(prevState.txReceipt);
    });
  });
  describe('SIGN', () => {
    // TODO
  });
  describe('WEB3_SIGN', () => {
    // TODO
  });
  describe('SEND', () => {
    it('sets send to true and otherwise keeps the state as is', () => {
      const prevState = { txReceipt: undefined, txConfig: undefined, signedTx: undefined };
      const newState = dispatch({ type: ActionType.SEND, payload: undefined })(prevState);
      expect(newState.send).toEqual(true);

      expect(newState.signedTx).toEqual(prevState.signedTx);
      expect(newState.txReceipt).toEqual(prevState.txReceipt);
      expect(newState.txConfig).toEqual(prevState.txConfig);
    });
  });
  describe('AFTER_SEND', () => {
    // TODO
  });
  describe('RESUBMIT', () => {
    // TODO
  });
});
