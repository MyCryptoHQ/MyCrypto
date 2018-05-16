import BN from 'bn.js';
import { Wei } from 'libs/units';
import { getInitialState } from '../helpers';
import { RequestStatus } from './types';
import {
  getTransactionStatus,
  currentTransactionFailed,
  currentTransactionBroadcasting,
  currentTransactionBroadcasted,
  getCurrentTransactionStatus,
  getCurrentValue,
  getCurrentTo,
  isEtherTransaction,
  isValidCurrentTo,
  isValidGasPrice,
  isValidGasLimit,
  getCurrentToAddressMessage,
  isCurrentToLabelEntry,
  getData,
  getFields,
  getGasLimit,
  getValue,
  getTo,
  getNonce,
  getGasPrice,
  getDataExists,
  getValidGasCost,
  getFrom,
  getDecimal,
  getTokenValue,
  getTokenTo,
  getUnit,
  getPreviousUnit,
  getDecimalFromUnit,
  getNetworkStatus,
  nonceRequestPending,
  nonceRequestFailed,
  isNetworkRequestPending,
  getGasEstimationPending,
  getGasLimitEstimationTimedOut,
  signaturePending,
  getSignedTx,
  getWeb3Tx,
  getSignState,
  getSerializedTransaction
} from './selectors';
import cloneDeep from 'lodash/cloneDeep';

const initialState = cloneDeep(getInitialState());

//#region Broadcast
describe('broadcast selector', () => {
  const state = getInitialState();
  state.transaction = {
    ...state.transaction,
    broadcast: {
      ...state.transaction.broadcast,
      testIndexingHash1: {
        broadcastedHash: 'testBroadcastedHash',
        broadcastSuccessful: true,
        isBroadcasting: false,
        serializedTransaction: new Buffer([1, 2, 3])
      },
      testIndexingHash2: {
        broadcastedHash: 'testBroadcastedHash',
        broadcastSuccessful: true,
        isBroadcasting: false,
        serializedTransaction: new Buffer([1, 2, 3])
      }
    },
    sign: {
      ...state.transaction.sign,
      indexingHash: 'testIndexingHash1',
      pending: false
    }
  };
  it('should check getTransactionState with an indexing hash', () => {
    expect(getTransactionStatus(state, 'testIndexingHash1')).toEqual(
      state.transaction.broadcast.testIndexingHash1
    );
  });

  it('should check getCurrentTransactionStatus', () => {
    expect(getCurrentTransactionStatus(state)).toEqual(
      state.transaction.broadcast.testIndexingHash2
    );
  });

  it('should check currentTransactionFailed', () => {
    expect(currentTransactionFailed(state)).toEqual(false);
  });

  it('should check currentTransactionBroadcasting', () => {
    expect(currentTransactionBroadcasting(state)).toEqual(false);
  });

  it('should check currentTransactionBroadcasted', () => {
    expect(currentTransactionBroadcasted(state)).toEqual(true);
  });

  it('should return false on getCurrentTransactionStatus if no index hash present', () => {
    state.transaction.sign.indexingHash = null;
    expect(getCurrentTransactionStatus(state)).toEqual(false);
  });
});
//#endregion Broadcast

//#region Current
describe('current selector', () => {
  const state = getInitialState();
  state.transaction = {
    ...state.transaction,
    fields: {
      ...state.transaction.fields,
      to: {
        raw: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
        value: new Buffer([0, 1, 2, 3])
      },
      gasLimit: {
        raw: '21000',
        value: Wei('21000')
      },
      gasPrice: {
        raw: '1500',
        value: Wei('1500')
      }
    },
    meta: {
      ...state.transaction.meta,
      unit: 'ETH',
      previousUnit: 'ETH'
    }
  };

  it('should get stored receiver address on getCurrentTo', () => {
    expect(getCurrentTo(state)).toEqual(state.transaction.fields.to);
  });

  it('should get stored value on getCurrentValue', () => {
    expect(getCurrentValue(state)).toEqual(state.transaction.fields.value);
  });

  it('should get message to the receiver', () => {
    expect(getCurrentToAddressMessage(state)).toEqual({
      msg: 'Thank you for donating to MyCrypto. TO THE MOON!'
    });
  });

  it('should check isValidGasPrice', () => {
    expect(isValidGasPrice(state)).toEqual(true);
  });

  it('should check isEtherTransaction', () => {
    expect(isEtherTransaction(state)).toEqual(true);
  });

  it('should check isValidGasLimit', () => {
    expect(isValidGasLimit(state)).toEqual(true);
  });

  it('should check isValidCurrentTo', () => {
    expect(isValidCurrentTo(state)).toEqual(true);
  });

  it('should check isCurrentToLabelEntry', () => {
    expect(isCurrentToLabelEntry(state)).toEqual(false);

    const otherState = { ...state };
    otherState.transaction = {
      ...state.transaction,
      fields: { ...state.transaction.fields, to: { ...state.transaction.fields.to, raw: 'derp' } }
    };

    expect(isCurrentToLabelEntry(otherState)).toEqual(true);
  });
});

//#endregion Current

//#region Fields
describe('network selector', () => {
  const state = getInitialState();
  state.transaction.fields = {
    to: {
      raw: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
      value: new Buffer([0, 1, 2, 3])
    },
    data: {
      raw: '',
      value: null
    },
    nonce: {
      raw: '0',
      value: new BN('0')
    },
    value: {
      raw: '1000000000',
      value: Wei('1000000000')
    },
    gasLimit: {
      raw: '21000',
      value: Wei('21000')
    },
    gasPrice: {
      raw: '1500',
      value: Wei('1500')
    }
  };

  it('should get fields from fields store', () => {
    expect(getFields(state)).toEqual(state.transaction.fields);
  });

  it('should get data from fields store', () => {
    expect(getData(state)).toEqual(state.transaction.fields.data);
  });

  it('should get gas limit from fields store', () => {
    expect(getGasLimit(state)).toEqual(state.transaction.fields.gasLimit);
  });

  it('should get value from fields store', () => {
    expect(getValue(state)).toEqual(state.transaction.fields.value);
  });

  it('sould get receiver address from fields store', () => {
    expect(getTo(state)).toEqual(state.transaction.fields.to);
  });

  it('should get nonce from fields store', () => {
    expect(getNonce(state)).toEqual(state.transaction.fields.nonce);
  });

  it('should get gas price from fields store', () => {
    expect(getGasPrice(state)).toEqual(state.transaction.fields.gasPrice);
  });

  it('should check getDataExists', () => {
    expect(getDataExists(state)).toEqual(false);
  });

  it('should check when gas cost is valid', () => {
    expect(getValidGasCost(state)).toEqual(true);
  });

  it('should check when gas cost is invalid', () => {
    state.wallet.balance = {
      wei: Wei('0'),
      isPending: false
    };
    expect(getValidGasCost(state)).toEqual(false);
  });
});

//#endregion Fields

//#region Meta
describe('meta tests', () => {
  const state = { ...initialState };
  (state.transaction.meta = {
    unit: 'ETH',
    previousUnit: 'ETH',
    decimal: 18,
    tokenValue: {
      raw: '',
      value: null
    },
    tokenTo: {
      raw: '',
      value: null
    },
    from: 'fromAddress',
    isContractInteraction: false
  }),
    (state.customTokens = [
      {
        address: '0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7',
        symbol: 'UNI',
        decimal: 0
      }
    ]);

  it('should get the stored sender address', () => {
    expect(getFrom(state)).toEqual(state.transaction.meta.from);
  });

  it('should get the stored decimal', () => {
    expect(getDecimal(state)).toEqual(state.transaction.meta.decimal);
  });

  it('should get the token value', () => {
    expect(getTokenValue(state)).toEqual(state.transaction.meta.tokenValue);
  });

  it('should get the token receiver address', () => {
    expect(getTokenTo(state)).toEqual(state.transaction.meta.tokenTo);
  });

  it('should get the stored unit', () => {
    expect(getUnit(state)).toEqual(state.transaction.meta.unit);
  });

  it('should get the stored previous unit', () => {
    expect(getPreviousUnit(state)).toEqual(state.transaction.meta.previousUnit);
  });

  it('should get the decimal for ether', () => {
    expect(getDecimalFromUnit(state, getUnit(state))).toEqual(18);
  });

  it('should get the decimal for a token', () => {
    expect(getDecimalFromUnit(state, 'UNI')).toEqual(0);
  });

  it('should throw error if the token is not found', () => {
    expect(() => getDecimalFromUnit(state, 'ABC')).toThrowError(`Token ABC not found`);
  });
});

//#endregion Meta

//#region Network
describe('network selector', () => {
  const state = getInitialState();
  state.transaction.network = {
    ...state.transaction.network,
    gasEstimationStatus: RequestStatus.REQUESTED,
    getFromStatus: RequestStatus.SUCCEEDED,
    getNonceStatus: RequestStatus.REQUESTED,
    gasPriceStatus: RequestStatus.SUCCEEDED
  };

  it('should get network status', () => {
    expect(getNetworkStatus(state)).toEqual(state.transaction.network);
  });

  it('should check with the store if the nonce request is pending', () => {
    expect(nonceRequestPending(state)).toEqual(true);
  });

  it('should check with the store if the nonce request failed', () => {
    state.transaction.network.getNonceStatus = RequestStatus.FAILED;
    expect(nonceRequestFailed(state)).toEqual(true);
  });

  it('should check with the store if the gas estimation is pending', () => {
    expect(getGasEstimationPending(state)).toEqual(true);
  });

  it('should check with the store if gas limit estimation timed out', () => {
    state.transaction.network.gasEstimationStatus = RequestStatus.TIMEDOUT;
    expect(getGasLimitEstimationTimedOut(state)).toEqual(true);
  });

  it('should check with the store if network request is pending', () => {
    state.transaction.network.gasEstimationStatus = RequestStatus.REQUESTED;
    expect(isNetworkRequestPending(state)).toEqual(true);
  });
});

//#endregion Network

//#region Sign
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

//#endregion Sign
