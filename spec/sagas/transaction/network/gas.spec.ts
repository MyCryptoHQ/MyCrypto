import { buffers, delay } from 'redux-saga';
import { apply, put, select, take, actionChannel, call, race } from 'redux-saga/effects';
import { getNodeLib, getOffline, getAutoGasLimitEnabled } from 'selectors/config';
import { getWalletInst } from 'selectors/wallet';
import { getTransaction } from 'selectors/transaction';
import {
  setGasLimitField,
  estimateGasFailed,
  estimateGasSucceeded,
  TypeKeys,
  estimateGasRequested,
  estimateGasTimedout
} from 'actions/transaction';
import { makeTransaction, getTransactionFields } from 'libs/transaction';
import { shouldEstimateGas, estimateGas, localGasEstimation } from 'sagas/transaction/network/gas';
import { cloneableGenerator } from 'redux-saga/utils';
import { Wei } from 'libs/units';
import { TypeKeys as ConfigTypeKeys } from 'actions/config';

describe('shouldEstimateGas*', () => {
  const offline = false;
  const autoGasLimitEnabled = true;
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
    type: TypeKeys.TO_FIELD_SET,
    payload: {
      value: 'value',
      raw: 'raw'
    }
  };

  const gen = shouldEstimateGas();

  it('should take expected types', () => {
    expect(gen.next().value).toEqual(
      take([
        TypeKeys.TO_FIELD_SET,
        TypeKeys.DATA_FIELD_SET,
        TypeKeys.ETHER_TO_TOKEN_SWAP,
        TypeKeys.TOKEN_TO_TOKEN_SWAP,
        TypeKeys.TOKEN_TO_ETHER_SWAP,
        ConfigTypeKeys.CONFIG_TOGGLE_AUTO_GAS_LIMIT
      ])
    );
  });

  it('should select getOffline', () => {
    expect(gen.next(action).value).toEqual(select(getOffline));
  });

  it('should select autoGasLimitEnabled', () => {
    expect(gen.next(offline).value).toEqual(select(getAutoGasLimitEnabled));
  });

  it('should select getTransaction', () => {
    expect(gen.next(autoGasLimitEnabled).value).toEqual(select(getTransaction));
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

  const gens: { [name: string]: any } = {};
  gens.successCase = cloneableGenerator(estimateGas)();

  let random;
  beforeAll(() => {
    random = Math.random;
    Math.random = () => 0.001;
  });

  afterAll(() => {
    Math.random = random;
  });

  it('should yield actionChannel', () => {
    const expected = JSON.stringify(
      actionChannel(TypeKeys.ESTIMATE_GAS_REQUESTED, buffers.sliding(1))
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

  it('should put setGasLimitField', () => {
    gens.timeOutCase = gens.successCase.clone();
    expect(gens.successCase.next(successfulGasEstimationResult).value).toEqual(
      put(
        setGasLimitField({
          raw: gasLimit.toString(),
          value: gasLimit
        })
      )
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
