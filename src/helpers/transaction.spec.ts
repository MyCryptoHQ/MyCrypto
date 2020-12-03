import { BigNumber } from 'ethers/utils';

import { donationAddressMap } from '@config';
import {
  fAccounts,
  fAssets,
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
  fFinishedERC20Web3TxReceipt,
  fNetwork,
  fNetworks,
  fRopDAI
} from '@fixtures';
import {
  ITxData,
  ITxGasLimit,
  ITxGasPrice,
  ITxHash,
  ITxStatus,
  ITxToAddress,
  ITxType,
  ITxValue,
  TAddress
} from '@types';

import {
  appendGasPrice,
  appendNonce,
  appendSender,
  deriveTxFields,
  deriveTxRecipientsAndAmount,
  ERCType,
  guessERC20Type,
  makeFinishedTxReceipt,
  makePendingTxReceipt,
  makeTxConfigFromTxResponse,
  toTxReceipt,
  verifyTransaction
} from './transaction';

jest.mock('@services/ApiService/Gas', () => ({
  fetchGasPriceEstimates: () => new Promise((resolve, _) => resolve({ fast: 20 }))
}));

jest.mock('@services/EthService/nonce', () => ({
  getNonce: () => new Promise((resolve, _) => resolve(1))
}));

const senderAddr = donationAddressMap.ETH as TAddress;

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

describe('guessERC20Type', () => {
  it('interprets an erc20 transfer data field to be an erc20 transfer', () => {
    const erc20DataField =
      '0xa9059cbb0000000000000000000000005dd6e754d37bababeb95f34639568812900fec79000000000000000000000000000000000000000000000104f6e0a229913de8a2';
    const ercType = guessERC20Type(erc20DataField);
    expect(ercType).toBe(ERCType.TRANSFER);
  });

  it('interprets an eth tx data field to not be an erc20 transfer', () => {
    const ethTxDataField = '0x0';
    const ercType = guessERC20Type(ethTxDataField);
    expect(ercType).toBe(ERCType.NONE);
  });

  it('interprets an swap tx data field to not be an erc20 transfer', () => {
    const swapTxDataField =
      '0x5d46ec34000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000000000000000000000000000022316b495dd19fe0000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000001158e460913d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000002a1530c4c41db0b0b2bb646cb5eb1a67b71586670000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000446b1d4db7000000000000000000000000000000000000000000000001158e460913d00000000000000000000000000000000000000000000000000000000000005e7a6099000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000440000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000022316b495dd19fe';
    const ercType = guessERC20Type(swapTxDataField);
    expect(ercType).toBe(ERCType.NONE);
  });
});

describe('deriveTxRecipientsAndAmount', () => {
  it("interprets an erc20 transfer's recipients and amounts correctly", () => {
    const erc20DataField =
      '0xa9059cbb0000000000000000000000005dd6e754d37bababeb95f34639568812900fec79000000000000000000000000000000000000000000000104f6e0a229913de8a2';
    const toAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const value = '0x0';
    const { to, amount, receiverAddress } = deriveTxRecipientsAndAmount(
      ERCType.TRANSFER,
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
      ERCType.NONE,
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

describe('deriveTxFields', () => {
  it("interprets an erc20 transfer's fields correctly", () => {
    const erc20DataField =
      '0xa9059cbb0000000000000000000000005dd6e754d37bababeb95f34639568812900fec79000000000000000000000000000000000000000000000104f6e0a229913de8a2';
    const toAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const value = '0x0';
    const result = deriveTxFields(
      ERCType.TRANSFER,
      erc20DataField as ITxData,
      toAddress as ITxToAddress,
      value as ITxValue,
      fAssets[1],
      fRopDAI
    );
    expect(result).toStrictEqual({
      to: toAddress,
      receiverAddress: '0x5dd6e754D37baBaBEb95F34639568812900feC79',
      amount: '4813.942855992010991778',
      asset: fRopDAI
    });
  });
  it("interprets an erc20 approve's fields correctly", () => {
    const erc20DataField =
      '0x095ea7b30000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    const toAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const value = '0x0';
    const result = deriveTxFields(
      ERCType.APPROVAL,
      erc20DataField as ITxData,
      toAddress as ITxToAddress,
      value as ITxValue,
      fAssets[1],
      fRopDAI
    );
    expect(result).toStrictEqual({
      to: toAddress,
      receiverAddress: toAddress,
      amount: '0',
      asset: fRopDAI
    });
  });
  it("interprets an eth tx's fields correctly", () => {
    const erc20DataField = '0x';
    const toAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const value = '0x54ab1b2ceea88000';
    const result = deriveTxFields(
      ERCType.NONE,
      erc20DataField as ITxData,
      toAddress as ITxToAddress,
      value as ITxValue,
      fAssets[1],
      fRopDAI
    );
    expect(result).toStrictEqual({
      to: toAddress,
      receiverAddress: toAddress,
      amount: '6.101',
      asset: fAssets[1]
    });
  });
});

describe('makeTxConfigFromTxResponse', () => {
  it('interprets an web3 tx response correctly', () => {
    const toAddress = '0x5197B5b062288Bbf29008C92B08010a92Dd677CD';
    const result = makeTxConfigFromTxResponse(fETHWeb3TxResponse, fAssets, fNetwork, fAccounts);
    expect(result).toStrictEqual(
      expect.objectContaining({
        from: toAddress,
        receiverAddress: toAddress,
        amount: '0.01',
        asset: fAssets[1]
      })
    );
  });
});

describe('appendSender', () => {
  it('appends sender to transaction input', () => {
    const input = {
      to: senderAddr,
      value: '0x0' as ITxValue,
      data: '0x0' as ITxData,
      chainId: 1
    };
    const actual = appendSender(senderAddr)(input);
    const expected = {
      to: senderAddr,
      value: '0x0',
      data: '0x0',
      chainId: 1,
      from: senderAddr
    };
    expect(actual).toStrictEqual(expected);
  });
});

describe('appendGasPrice', () => {
  it('appends gas price to transaction input', async () => {
    const input = {
      to: senderAddr,
      value: '0x0' as ITxValue,
      data: '0x0' as ITxData,
      chainId: 1
    };
    const actual = await appendGasPrice(fNetworks[0])(input);
    const expected = {
      to: senderAddr,
      value: '0x0',
      data: '0x0',
      chainId: 1,
      gasPrice: '0x4a817c800'
    };
    expect(actual).toStrictEqual(expected);
  });
});

describe('appendNonce', () => {
  it('appends nonce to transaction input', async () => {
    const input = {
      to: senderAddr,
      value: '0x0' as ITxValue,
      data: '0x0' as ITxData,
      chainId: 1,
      gasPrice: '0x4a817c800' as ITxGasPrice,
      gasLimit: '0x5208' as ITxGasLimit,
      from: senderAddr
    };
    const actual = await appendNonce(fNetworks[0], senderAddr)(input);
    const expected = {
      to: senderAddr,
      value: '0x0' as ITxValue,
      data: '0x0' as ITxData,
      chainId: 1,
      gasPrice: '0x4a817c800' as ITxGasPrice,
      gasLimit: '0x5208' as ITxGasLimit,
      from: senderAddr,
      nonce: '0x1'
    };
    expect(actual).toStrictEqual(expected);
  });
});

describe('verifyTransaction', () => {
  it('verifies a signed transaction', () => {
    expect(
      verifyTransaction({
        to: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
        value: new BigNumber('0x0'),
        data: '0x',
        chainId: 1,
        gasLimit: new BigNumber('0x5208'),
        gasPrice: new BigNumber('0x1'),
        nonce: 1,
        r: '0x7e833413ead52b8c538001b12ab5a85bac88db0b34b61251bb0fc81573ca093f',
        s: '0x49634f1e439e3760265888434a2f9782928362412030db1429458ddc9dcee995',
        v: 37
      })
    ).toBe(true);
  });

  it('returns false for transactions with an invalid s value', () => {
    expect(
      verifyTransaction({
        to: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
        value: new BigNumber('0x0'),
        data: '0x',
        chainId: 1,
        gasLimit: new BigNumber('0x5208'),
        gasPrice: new BigNumber('0x1'),
        nonce: 1,
        r: '0x7e833413ead52b8c538001b12ab5a85bac88db0b34b61251bb0fc81573ca093f',
        s: '0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a1',
        v: 37
      })
    ).toBe(false);
  });

  it('returns false for transactions with an invalid v value', () => {
    expect(
      verifyTransaction({
        to: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
        value: new BigNumber('0x0'),
        data: '0x',
        chainId: 1,
        gasLimit: new BigNumber('0x5208'),
        gasPrice: new BigNumber('0x1'),
        nonce: 1,
        r: '0x7e833413ead52b8c538001b12ab5a85bac88db0b34b61251bb0fc81573ca093f',
        s: '0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a1',
        v: 12345
      })
    ).toBe(false);
  });

  it('returns false for transactions with an invalid signature', () => {
    expect(
      verifyTransaction({
        to: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
        value: new BigNumber('0x0'),
        data: '0x',
        chainId: 1,
        gasLimit: new BigNumber('0x5208'),
        gasPrice: new BigNumber('0x1'),
        nonce: 1,
        r: '0x12345',
        s: '0x12345',
        v: 37
      })
    ).toBe(false);
  });

  it('returns false for transactions without a signature', () => {
    expect(
      verifyTransaction({
        to: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
        value: new BigNumber('0x0'),
        data: '0x',
        chainId: 1,
        gasLimit: new BigNumber('0x5208'),
        gasPrice: new BigNumber('0x1'),
        nonce: 1
      })
    ).toBe(false);
  });
});
