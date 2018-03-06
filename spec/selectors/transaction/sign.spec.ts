import {
  signaturePending,
  getSignedTx,
  getWeb3Tx,
  getSignState,
  getSerializedTransaction
} from 'selectors/transaction/sign';
import { getInitialState } from '../helpers';

describe('sign tests', () => {
  const state = getInitialState();
  (state.transaction.sign = {
    indexingHash: 'testIndexingHash',
    pending: false,
    local: {
      signedTransaction: new Buffer([4, 5, 6, 7])
    },
    web3: {
      transaction: null
    }
  }),
    it('should return whether the current signature is pending', () => {
      expect(signaturePending(state)).toEqual({
        isHardwareWallet: false,
        isSignaturePending: false
      });
    });

  it('should should get the stored sign state', () => {
    expect(getSignState(state)).toEqual(state.transaction.sign);
  });

  it('should get the signed local transaction state', () => {
    expect(getSignedTx(state)).toEqual(state.transaction.sign.local.signedTransaction);
  });

  it('should get the signed web3 transaction state', () => {
    expect(getWeb3Tx(state)).toEqual(state.transaction.sign.web3.transaction);
  });

  it('should get the serialized transaction state', () => {
    expect(getSerializedTransaction(state)).toEqual(new Buffer([4, 5, 6, 7]));
  });
});
