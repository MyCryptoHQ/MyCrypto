import {
  fETHNonWeb3TxConfig,
  fETHNonWeb3TxResponse,
  fETHNonWeb3TxReceipt,
  fETHWeb3TxConfig,
  fETHWeb3TxResponse,
  fETHWeb3TxReceipt,
  fERC20NonWeb3TxConfig,
  fERC20NonWeb3TxResponse,
  fERC20NonWeb3TxReceipt,
  fERC20Web3TxConfig,
  fERC20Web3TxResponse,
  fERC20Web3TxReceipt,
  fFinishedERC20Web3TxReceipt,
  fFinishedERC20NonWeb3TxReceipt
} from '@fixtures';
import { ITxStatus, ITxType, ITxHash } from '@types';

import { toTxReceipt, makePendingTxReceipt, makeFinishedTxReceipt } from './transaction';

describe('toTxReceipt', () => {
  it('creates tx receipt for non-web3 eth tx', () => {
    const txReceipt = toTxReceipt(fETHNonWeb3TxResponse.hash as ITxHash, ITxStatus.PENDING)(
      ITxType.STANDARD,
      fETHNonWeb3TxConfig
    );
    expect(txReceipt).toStrictEqual(fETHNonWeb3TxReceipt);
  });

  it('creates tx receipt for web3 eth tx', () => {
    const txReceipt = toTxReceipt(fETHWeb3TxResponse.hash as ITxHash, ITxStatus.PENDING)(
      ITxType.STANDARD,
      fETHWeb3TxConfig
    );
    expect(txReceipt).toStrictEqual(fETHWeb3TxReceipt);
  });

  it('creates tx receipt for non-web3 erc20 tx', () => {
    const txReceipt = toTxReceipt(fERC20NonWeb3TxResponse.hash as ITxHash, ITxStatus.PENDING)(
      ITxType.STANDARD,
      fERC20NonWeb3TxConfig
    );
    expect(txReceipt).toStrictEqual(fERC20NonWeb3TxReceipt);
  });

  it('creates tx receipt for web3 erc20 tx', () => {
    const txReceipt = toTxReceipt(fERC20Web3TxResponse.hash as ITxHash, ITxStatus.PENDING)(
      ITxType.STANDARD,
      fERC20Web3TxConfig
    );
    expect(txReceipt).toStrictEqual(fERC20Web3TxReceipt);
  });
});

describe('makePendingTxReceipt', () => {
  it('creates pending tx receipt for non-web3 eth tx', () => {
    const txReceipt = makePendingTxReceipt(fETHNonWeb3TxResponse.hash as ITxHash)(
      ITxType.STANDARD,
      fETHNonWeb3TxConfig
    );
    expect(txReceipt).toStrictEqual(fETHNonWeb3TxReceipt);
  });

  it('creates pending tx receipt for web3 eth tx', () => {
    const txReceipt = makePendingTxReceipt(fETHWeb3TxResponse.hash as ITxHash)(
      ITxType.STANDARD,
      fETHWeb3TxConfig
    );
    expect(txReceipt).toStrictEqual(fETHWeb3TxReceipt);
  });

  it('creates pending tx receipt for non-web3 erc20 tx', () => {
    const txReceipt = toTxReceipt(fERC20NonWeb3TxResponse.hash as ITxHash, ITxStatus.PENDING)(
      ITxType.STANDARD,
      fERC20NonWeb3TxConfig
    );
    expect(txReceipt).toStrictEqual(fERC20NonWeb3TxReceipt);
  });

  it('creates pending tx receipt for web3 erc20 tx', () => {
    const txReceipt = toTxReceipt(fERC20Web3TxResponse.hash as ITxHash, ITxStatus.PENDING)(
      ITxType.STANDARD,
      fERC20Web3TxConfig
    );
    expect(txReceipt).toStrictEqual(fERC20Web3TxReceipt);
  });
});

describe('makeFinishedTxReceipt', () => {
  it('updates pending erc20 web3 tx to finished', () => {
    const finishedTimestamp = 1590735286;
    const finishedBlock = 7991049;
    const finishedTxReceipt = makeFinishedTxReceipt(
      fERC20Web3TxReceipt,
      ITxStatus.SUCCESS,
      finishedTimestamp,
      finishedBlock
    );
    expect(finishedTxReceipt).toStrictEqual(fFinishedERC20Web3TxReceipt);
  });

  it('updates pending erc20 non-web3 tx to finished', () => {
    const finishedTimestamp = 1590734231;
    const finishedBlock = 7990974;
    const finishedTxReceipt = makeFinishedTxReceipt(
      fERC20NonWeb3TxReceipt,
      ITxStatus.SUCCESS,
      finishedTimestamp,
      finishedBlock
    );
    expect(finishedTxReceipt).toStrictEqual(fFinishedERC20NonWeb3TxReceipt);
  });
});
