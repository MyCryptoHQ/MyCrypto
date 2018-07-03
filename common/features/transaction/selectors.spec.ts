import BN from 'bn.js';
import cloneDeep from 'lodash/cloneDeep';

import { Wei } from 'libs/units';
import * as helpers from 'features/helpers';
import * as testHelpers from 'features/testHelpers';
import * as derivedSelectors from 'features/selectors';
import { transactionBroadcastSelectors } from './broadcast';
import { transactionFieldsSelectors } from './fields';
import { transactionMetaSelectors } from './meta';
import { transactionNetworkTypes, transactionNetworkSelectors } from './network';
import { transactionSignSelectors } from './sign';
import * as selectors from './selectors';

const initialState = cloneDeep(testHelpers.getInitialState());

describe('helpers selector', () => {
  const state = testHelpers.getInitialState();
  state.transaction = {
    ...state.transaction,
    meta: {
      ...state.transaction.meta,
      unit: 'ETH'
    },
    fields: {
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
    }
  };

  it('should reduce the fields state to its base values', () => {
    const values = {
      data: null,
      gasLimit: Wei('21000'),
      gasPrice: Wei('1500'),
      nonce: new BN('0'),
      to: new Buffer([0, 1, 2, 3]),
      value: Wei('1000000000')
    };
    expect(helpers.reduceToValues(state.transaction.fields)).toEqual(values);
  });

  it('should check isFullTransaction with full transaction arguments', () => {
    const currentTo = derivedSelectors.getCurrentTo(state);
    const currentValue = derivedSelectors.getCurrentValue(state);
    const transactionFields = transactionFieldsSelectors.getFields(state);
    const unit = derivedSelectors.getUnit(state);
    const dataExists = selectors.getDataExists(state);
    const validGasCost = derivedSelectors.getValidGasCost(state);
    const isFullTransaction = helpers.isFullTx(
      state,
      transactionFields,
      currentTo,
      currentValue,
      dataExists,
      validGasCost,
      unit
    );
    expect(isFullTransaction).toEqual(true);
  });

  it('should check isFullTransaction without full transaction arguments', () => {
    const currentTo = { raw: '', value: null };
    const currentValue = derivedSelectors.getCurrentValue(state);
    const transactionFields = transactionFieldsSelectors.getFields(state);
    const unit = derivedSelectors.getUnit(state);
    const dataExists = selectors.getDataExists(state);
    const validGasCost = derivedSelectors.getValidGasCost(state);
    const isFullTransaction = helpers.isFullTx(
      state,
      transactionFields,
      currentTo,
      currentValue,
      dataExists,
      validGasCost,
      unit
    );
    expect(isFullTransaction).toEqual(false);
  });
});

//#region Broadcast
describe('broadcast selector', () => {
  const state = testHelpers.getInitialState();
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
    expect(transactionBroadcastSelectors.getTransactionStatus(state, 'testIndexingHash1')).toEqual(
      state.transaction.broadcast.testIndexingHash1
    );
  });

  it('should check getCurrentTransactionStatus', () => {
    expect(selectors.getCurrentTransactionStatus(state)).toEqual(
      state.transaction.broadcast.testIndexingHash2
    );
  });

  it('should check currentTransactionFailed', () => {
    expect(selectors.currentTransactionFailed(state)).toEqual(false);
  });

  it('should check currentTransactionBroadcasting', () => {
    expect(selectors.currentTransactionBroadcasting(state)).toEqual(false);
  });

  it('should check currentTransactionBroadcasted', () => {
    expect(selectors.currentTransactionBroadcasted(state)).toEqual(true);
  });

  it('should return false on getCurrentTransactionStatus if no index hash present', () => {
    state.transaction.sign.indexingHash = null;
    expect(selectors.getCurrentTransactionStatus(state)).toEqual(false);
  });
});
//#endregion Broadcast

//#region Current
describe('current selector', () => {
  const state = testHelpers.getInitialState();
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
    expect(derivedSelectors.getCurrentTo(state)).toEqual(state.transaction.fields.to);
  });

  it('should get stored value on getCurrentValue', () => {
    expect(derivedSelectors.getCurrentValue(state)).toEqual(state.transaction.fields.value);
  });

  it('should get message to the receiver', () => {
    expect(derivedSelectors.getCurrentToAddressMessage(state)).toEqual({
      msg: 'Thank you for donating to MyCrypto. TO THE MOON!'
    });
  });

  it('should check isValidGasPrice', () => {
    expect(selectors.isValidGasPrice(state)).toEqual(true);
  });

  it('should check isEtherTransaction', () => {
    expect(derivedSelectors.isEtherTransaction(state)).toEqual(true);
  });

  it('should check isValidGasLimit', () => {
    expect(selectors.isValidGasLimit(state)).toEqual(true);
  });

  it('should check isValidCurrentTo', () => {
    expect(derivedSelectors.isValidCurrentTo(state)).toEqual(true);
  });

  it('should check isCurrentToLabelEntry', () => {
    expect(derivedSelectors.isCurrentToLabelEntry(state)).toEqual(false);

    const otherState = { ...state };
    otherState.transaction = {
      ...state.transaction,
      fields: { ...state.transaction.fields, to: { ...state.transaction.fields.to, raw: 'derp' } }
    };

    expect(derivedSelectors.isCurrentToLabelEntry(otherState)).toEqual(true);
  });
});

//#endregion Current

//#region Fields
describe('fields selector', () => {
  const state = testHelpers.getInitialState();
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
    expect(transactionFieldsSelectors.getFields(state)).toEqual(state.transaction.fields);
  });

  it('should get data from fields store', () => {
    expect(transactionFieldsSelectors.getData(state)).toEqual(state.transaction.fields.data);
  });

  it('should get gas limit from fields store', () => {
    expect(transactionFieldsSelectors.getGasLimit(state)).toEqual(
      state.transaction.fields.gasLimit
    );
  });

  it('should get value from fields store', () => {
    expect(transactionFieldsSelectors.getValue(state)).toEqual(state.transaction.fields.value);
  });

  it('sould get receiver address from fields store', () => {
    expect(transactionFieldsSelectors.getTo(state)).toEqual(state.transaction.fields.to);
  });

  it('should get nonce from fields store', () => {
    expect(transactionFieldsSelectors.getNonce(state)).toEqual(state.transaction.fields.nonce);
  });

  it('should get gas price from fields store', () => {
    expect(transactionFieldsSelectors.getGasPrice(state)).toEqual(
      state.transaction.fields.gasPrice
    );
  });

  it('should check getDataExists', () => {
    expect(selectors.getDataExists(state)).toEqual(false);
  });

  it('should check when gas cost is valid', () => {
    expect(derivedSelectors.getValidGasCost(state)).toEqual(true);
  });

  it('should check when gas cost is invalid', () => {
    state.wallet.balance = {
      wei: Wei('0'),
      isPending: false
    };
    expect(derivedSelectors.getValidGasCost(state)).toEqual(false);
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
    expect(derivedSelectors.getFrom(state)).toEqual(state.transaction.meta.from);
  });

  it('should get the stored decimal', () => {
    expect(transactionMetaSelectors.getDecimal(state)).toEqual(state.transaction.meta.decimal);
  });

  it('should get the token value', () => {
    expect(transactionMetaSelectors.getTokenValue(state)).toEqual(
      state.transaction.meta.tokenValue
    );
  });

  it('should get the token receiver address', () => {
    expect(transactionMetaSelectors.getTokenTo(state)).toEqual(state.transaction.meta.tokenTo);
  });

  it('should get the stored unit', () => {
    expect(derivedSelectors.getUnit(state)).toEqual(state.transaction.meta.unit);
  });

  it('should get the stored previous unit', () => {
    expect(selectors.getPreviousUnit(state)).toEqual(state.transaction.meta.previousUnit);
  });

  it('should get the decimal for ether', () => {
    expect(derivedSelectors.getDecimalFromUnit(state, derivedSelectors.getUnit(state))).toEqual(18);
  });

  it('should get the decimal for a token', () => {
    expect(derivedSelectors.getDecimalFromUnit(state, 'UNI')).toEqual(0);
  });

  it('should throw error if the token is not found', () => {
    expect(() => derivedSelectors.getDecimalFromUnit(state, 'ABC')).toThrowError(
      `Token ABC not found`
    );
  });
});

//#endregion Meta

//#region Network
describe('network selector', () => {
  const state = testHelpers.getInitialState();
  state.transaction.network = {
    ...state.transaction.network,
    gasEstimationStatus: transactionNetworkTypes.RequestStatus.REQUESTED,
    getFromStatus: transactionNetworkTypes.RequestStatus.SUCCEEDED,
    getNonceStatus: transactionNetworkTypes.RequestStatus.REQUESTED,
    gasPriceStatus: transactionNetworkTypes.RequestStatus.SUCCEEDED
  };

  it('should get network status', () => {
    expect(transactionNetworkSelectors.getNetworkStatus(state)).toEqual(state.transaction.network);
  });

  it('should check with the store if the nonce request is pending', () => {
    expect(transactionNetworkSelectors.nonceRequestPending(state)).toEqual(true);
  });

  it('should check with the store if the nonce request failed', () => {
    state.transaction.network.getNonceStatus = transactionNetworkTypes.RequestStatus.FAILED;
    expect(transactionNetworkSelectors.nonceRequestFailed(state)).toEqual(true);
  });

  it('should check with the store if the gas estimation is pending', () => {
    expect(transactionNetworkSelectors.getGasEstimationPending(state)).toEqual(true);
  });

  it('should check with the store if gas limit estimation timed out', () => {
    state.transaction.network.gasEstimationStatus = transactionNetworkTypes.RequestStatus.TIMEDOUT;
    expect(transactionNetworkSelectors.getGasLimitEstimationTimedOut(state)).toEqual(true);
  });

  it('should check with the store if network request is pending', () => {
    state.transaction.network.gasEstimationStatus = transactionNetworkTypes.RequestStatus.REQUESTED;
    expect(transactionNetworkSelectors.isNetworkRequestPending(state)).toEqual(true);
  });
});

//#endregion Network

//#region Sign
describe('sign tests', () => {
  const state = testHelpers.getInitialState();
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
      expect(derivedSelectors.signaturePending(state)).toEqual({
        isHardwareWallet: false,
        isSignaturePending: false
      });
    });

  it('should should get the stored sign state', () => {
    expect(transactionSignSelectors.getSignState(state)).toEqual(state.transaction.sign);
  });

  it('should get the signed local transaction state', () => {
    expect(transactionSignSelectors.getSignedTx(state)).toEqual(
      state.transaction.sign.local.signedTransaction
    );
  });

  it('should get the signed web3 transaction state', () => {
    expect(transactionSignSelectors.getWeb3Tx(state)).toEqual(
      state.transaction.sign.web3.transaction
    );
  });

  it('should get the serialized transaction state', () => {
    expect(derivedSelectors.getSerializedTransaction(state)).toEqual(new Buffer([4, 5, 6, 7]));
  });
});

//#endregion Sign
