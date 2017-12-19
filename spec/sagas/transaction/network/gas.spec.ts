import { buffers, delay } from 'redux-saga';
import { apply, put, select, take, actionChannel, call } from 'redux-saga/effects';
import { getNodeLib } from 'selectors/config';
import { getWalletInst } from 'selectors/wallet';
import { getTransaction } from 'selectors/transaction';
import {
  setGasLimitField,
  estimateGasFailed,
  estimateGasSucceeded,
  TypeKeys,
  estimateGasRequested
} from 'actions/transaction';
import { makeTransaction, getTransactionFields } from 'libs/transaction';
import { shouldEstimateGas, estimateGas } from 'sagas/transaction/network/gas';
import { cloneableGenerator } from 'redux-saga/utils';
import { Wei } from 'libs/units';

describe('shouldEstimateGas*', () => {
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
        TypeKeys.TOKEN_TO_ETHER_SWAP
      ])
    );
  });

  it('should select getTransaction', () => {
    expect(gen.next(action).value).toEqual(select(getTransaction));
  });

  it('should call getTransactionFields with transaction', () => {
    expect(gen.next(tx).value).toEqual(call(getTransactionFields, transaction));
  });

  it('should put estimatedGasRequested with rest', () => {
    expect(gen.next(transactionFields).value).toEqual(put(estimateGasRequested(rest)));
  });
});

describe('estimateGas*', () => {
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

  const gens: any = {};
  gens.gen = cloneableGenerator(estimateGas)();

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
    const result = JSON.stringify(gens.gen.next().value);
    expect(expected).toEqual(result);
  });

  it('should take requestChan', () => {
    expect(gens.gen.next(requestChan).value).toEqual(take(requestChan));
  });

  it('should call delay', () => {
    expect(gens.gen.next(action).value).toEqual(call(delay, 1000));
  });

  it('should select getNodeLib', () => {
    expect(gens.gen.next().value).toEqual(select(getNodeLib));
  });

  it('should select getWalletInst', () => {
    expect(gens.gen.next(node).value).toEqual(select(getWalletInst));
  });

  it('should apply walletInst', () => {
    expect(gens.gen.next(walletInst).value).toEqual(apply(walletInst, walletInst.getAddressString));
  });

  it('should apply node.estimateGas', () => {
    gens.clone = gens.gen.clone();
    expect(gens.gen.next(from).value).toEqual(apply(node, node.estimateGas, [txObj]));
  });

  it('should put setGasLimitField', () => {
    expect(gens.gen.next(gasLimit).value).toEqual(
      put(
        setGasLimitField({
          raw: gasLimit.toString(),
          value: gasLimit
        })
      )
    );
  });

  it('should put estimateGasSucceeded', () => {
    expect(gens.gen.next().value).toEqual(put(estimateGasSucceeded()));
  });

  describe('when it throws', () => {
    const tx = {
      getBaseFee: jest.fn()
    };

    it('should catch and put estimateGasFailed', () => {
      expect(gens.clone.throw().value).toEqual(put(estimateGasFailed()));
    });

    it('should call makeTransaction with payload', () => {
      expect(gens.clone.next().value).toEqual(call(makeTransaction, payload));
    });

    it('should apply tx.getBaseFee', () => {
      expect(gens.clone.next(tx).value).toEqual(apply(tx, tx.getBaseFee));
    });

    it('should put setGasLimitField', () => {
      expect(gens.clone.next(gasLimit).value).toEqual(
        put(
          setGasLimitField({
            raw: gasLimit.toString(),
            value: gasLimit
          })
        )
      );
    });
  });
});
