import {
  fERC20NonWeb3TxConfigJSON as fERC20NonWeb3TxConfig,
  fERC20NonWeb3TxReceipt,
  fERC20NonWeb3TxResponse,
  fERC20Web3TxConfigJSON as fERC20Web3TxConfig,
  fERC20Web3TxReceipt,
  fERC20Web3TxResponse,
  fETHNonWeb3TxConfigJSON as fETHNonWeb3TxConfig,
  fETHNonWeb3TxReceipt,
  fETHNonWeb3TxResponse,
  fETHWeb3TxConfigJSON as fETHWeb3TxConfig,
  fETHWeb3TxReceipt,
  fETHWeb3TxResponse,
  fFinishedERC20NonWeb3TxReceipt,
  fFinishedERC20Web3TxReceipt
} from '@fixtures';
import { ITxData, ITxHash, ITxStatus, ITxToAddress, ITxType, ITxValue } from '@types';

import {
  deriveTxRecipientsAndAmount,
  guessIfErc20Tx,
  makeFinishedTxReceipt,
  makePendingTxReceipt,
  toTxReceipt
} from './transaction';

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
    const finishedGasUsed = fERC20Web3TxReceipt.gasLimit;
    const confirmations = 1;
    const finishedTxReceipt = makeFinishedTxReceipt(
      fERC20Web3TxReceipt,
      ITxStatus.SUCCESS,
      finishedTimestamp,
      finishedBlock,
      finishedGasUsed,
      confirmations
    );
    expect(finishedTxReceipt).toStrictEqual(fFinishedERC20Web3TxReceipt);
  });

  it('updates pending erc20 non-web3 tx to finished', () => {
    const finishedTimestamp = 1590734231;
    const finishedBlock = 7990974;
    const finishedGasUsed = fERC20NonWeb3TxReceipt.gasLimit;
    const confirmations = 1;
    const finishedTxReceipt = makeFinishedTxReceipt(
      fERC20NonWeb3TxReceipt,
      ITxStatus.SUCCESS,
      finishedTimestamp,
      finishedBlock,
      finishedGasUsed,
      confirmations
    );
    expect(finishedTxReceipt).toStrictEqual(fFinishedERC20NonWeb3TxReceipt);
  });
});

describe('guessIfERC20Tx', () => {
  it('interprets an erc20 transfer data field to be an erc20 transfer', () => {
    const erc20DataField =
      '0xa9059cbb0000000000000000000000005dd6e754d37bababeb95f34639568812900fec79000000000000000000000000000000000000000000000104f6e0a229913de8a2';
    const isERC20TX = guessIfErc20Tx(erc20DataField);
    expect(isERC20TX).toBeTruthy();
  });

  it('interprets an eth tx data field to not be an erc20 transfer', () => {
    const ethTxDataField = '0x0';
    const isERC20TX = guessIfErc20Tx(ethTxDataField);
    expect(isERC20TX).toBeFalsy();
  });

  it('interprets an swap tx data field to not be an erc20 transfer', () => {
    const swapTxDataField =
      '0x5d46ec34000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000000000000000000000000000022316b495dd19fe0000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000001158e460913d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000002a1530c4c41db0b0b2bb646cb5eb1a67b71586670000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000446b1d4db7000000000000000000000000000000000000000000000001158e460913d00000000000000000000000000000000000000000000000000000000000005e7a6099000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000440000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000022316b495dd19fe';
    const isERC20TX = guessIfErc20Tx(swapTxDataField);
    expect(isERC20TX).toBeFalsy();
  });
});

describe('deriveTxRecipientsAndAmount', () => {
  it("interprets an erc20 transfer's recipients and amounts correctly", () => {
    const erc20DataField =
      '0xa9059cbb0000000000000000000000005dd6e754d37bababeb95f34639568812900fec79000000000000000000000000000000000000000000000104f6e0a229913de8a2';
    const toAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const value = '0x0';
    const { to, amount, receiverAddress } = deriveTxRecipientsAndAmount(
      true,
      erc20DataField as ITxData,
      toAddress as ITxToAddress,
      value as ITxValue
    );
    expect({ to, amount, receiverAddress }).toStrictEqual({
      to: toAddress,
      receiverAddress: '0x5dd6e754D37baBaBEb95F34639568812900feC79',
      amount: '4813942855992010991778'
    });
  });

  it("interprets an eth tx's recipients and amounts correctly", () => {
    const ethTxDataField = '0x0';
    const toAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const value = '0x104f6e0a229913de8a2';
    const { to, amount, receiverAddress } = deriveTxRecipientsAndAmount(
      false,
      ethTxDataField as ITxData,
      toAddress as ITxToAddress,
      value as ITxValue
    );
    expect({ to, amount, receiverAddress }).toStrictEqual({
      to: toAddress,
      receiverAddress: toAddress,
      amount: '0x104f6e0a229913de8a2'
    });
  });
});
