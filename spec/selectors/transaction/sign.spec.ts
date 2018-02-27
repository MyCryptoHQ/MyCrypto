import {
  signaturePending,
  getSignedTx,
  getWeb3Tx,
  getSignState,
  getSerializedTransaction
} from 'selectors/transaction/sign';
import TEST_STATE from './TestState.json';

describe('sign tests', () => {
  it('should return whether the current signature is pending', () => {
    expect(signaturePending(TEST_STATE)).toEqual({
      isHardwareWallet: false,
      isSignaturePending: false
    });
  });

  it('should should get the stored sign state', () => {
    expect(getSignState(TEST_STATE)).toEqual(TEST_STATE.transaction.sign);
  });

  it('should get the signed local transaction state', () => {
    expect(getSignedTx(TEST_STATE)).toEqual(TEST_STATE.transaction.sign.local.signedTransaction);
  });

  it('should get the signed web3 transaction state', () => {
    expect(getWeb3Tx(TEST_STATE)).toEqual(TEST_STATE.transaction.sign.web3.transaction);
  });

  it('should get the serialized transaction state', () => {
    expect(getSerializedTransaction(TEST_STATE)).toEqual({ data: [4, 5, 6, 7], type: 'Buffer' });
  });
});
