import { getAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';

import {
  DistributiveOmit,
  IFinishedTxReceipt,
  IPendingTxReceipt,
  ITxData,
  ITxFromAddress,
  ITxGasLimit,
  ITxGasPrice,
  ITxNonce,
  ITxObject,
  ITxReceipt,
  ITxStatus,
  ITxToAddress,
  ITxValue
} from '@types';
import { isType2Receipt } from '@utils';

import { default as erc20NonWeb3TxReceipt } from './erc20NonWeb3TxReceipt.json';
import { default as erc20NonWeb3TxReceiptFinished } from './erc20NonWeb3TxReceiptFinished.json';
import { default as erc20NonWeb3TxResponse } from './erc20NonWeb3TxResponse.json';
import { default as erc20Web3TxReceipt } from './erc20Web3TxReceipt.json';
import { default as erc20Web3TxReceiptFinished } from './erc20Web3TxReceiptFinished.json';
import { default as erc20Web3TxResponse } from './erc20Web3TxResponse.json';
import { default as ethNonWeb3TxReceipt } from './ethNonWeb3TxReceipt.json';
import { default as ethNonWeb3TxResponse } from './ethNonWeb3TxResponse.json';
import { default as ethWeb3TxReceipt } from './ethWeb3TxReceipt.json';
import { default as ethWeb3TxResponse } from './ethWeb3TxResponse.json';
import { default as txReceiptEIP1559 } from './txReceiptEIP1559.json';

const toTxResponse = (fixtureTxResponse: any): TransactionResponse => ({
  ...fixtureTxResponse,
  gasPrice: BigNumber.from(fixtureTxResponse.gasPrice),
  gasLimit: BigNumber.from(fixtureTxResponse.gasLimit),
  value: BigNumber.from(fixtureTxResponse.value)
});

const toTxReceipt = (fixtureTxReceipt: any): ITxReceipt => {
  const gas = isType2Receipt(fixtureTxReceipt)
    ? {
        maxFeePerGas: BigNumber.from(fixtureTxReceipt.maxFeePerGas),
        maxPriorityFeePerGas: BigNumber.from(fixtureTxReceipt.maxPriorityFeePerGas)
      }
    : { gasPrice: BigNumber.from(fixtureTxReceipt.gasPrice) };
  const result = {
    ...fixtureTxReceipt,
    to: getAddress(fixtureTxReceipt.to),
    from: getAddress(fixtureTxReceipt.from),
    receiverAddress: getAddress(fixtureTxReceipt.receiverAddress),
    ...gas,
    gasLimit: BigNumber.from(fixtureTxReceipt.gasLimit),
    nonce: BigNumber.from(fixtureTxReceipt.nonce),
    value: BigNumber.from(fixtureTxReceipt.value),
    status: fixtureTxReceipt.status as ITxStatus.PENDING | ITxStatus.SUCCESS | ITxStatus.FAILED
  };
  return {
    ...result,
    metadata: result.metadata ?? undefined,
    ...(fixtureTxReceipt.gasUsed && { gasUsed: BigNumber.from(fixtureTxReceipt.gasUsed) })
  };
};

export const fTransaction: ITxObject = {
  to: '0x909f74Ffdc223586d0d30E78016E707B6F5a45E2' as ITxToAddress,
  value: '0x38d7ea4c68000' as ITxValue,
  data: '0x' as ITxData,
  gasLimit: '0x5208' as ITxGasLimit,
  gasPrice: '0xee6b2800' as ITxGasPrice,
  nonce: '0x9' as ITxNonce,
  chainId: 3
};

export const fTransactionEIP1559: ITxObject = {
  to: '0x909f74Ffdc223586d0d30E78016E707B6F5a45E2' as ITxToAddress,
  value: '0x38d7ea4c68000' as ITxValue,
  data: '0x' as ITxData,
  gasLimit: '0x5208' as ITxGasLimit,
  maxFeePerGas: '0x4a817c800' as ITxGasPrice,
  maxPriorityFeePerGas: '0x3b9aca00' as ITxGasPrice,
  type: 2,
  nonce: '0x9' as ITxNonce,
  chainId: 3
};

export const fETHNonWeb3TxResponse: TransactionResponse = toTxResponse(ethNonWeb3TxResponse);
export const fETHWeb3TxResponse: TransactionResponse = toTxResponse(ethWeb3TxResponse);
export const fERC20NonWeb3TxResponse: TransactionResponse = toTxResponse(erc20NonWeb3TxResponse);
export const fERC20Web3TxResponse: TransactionResponse = toTxResponse(erc20Web3TxResponse);

export const fETHNonWeb3TxReceipt = toTxReceipt(ethNonWeb3TxReceipt) as IPendingTxReceipt;
export const fETHWeb3TxReceipt = toTxReceipt(ethWeb3TxReceipt) as IPendingTxReceipt;
export const fERC20NonWeb3TxReceipt = toTxReceipt(erc20NonWeb3TxReceipt) as IPendingTxReceipt;
export const fERC20Web3TxReceipt = toTxReceipt(erc20Web3TxReceipt) as IPendingTxReceipt;
export const fFinishedERC20NonWeb3TxReceipt = toTxReceipt(
  erc20NonWeb3TxReceiptFinished
) as IFinishedTxReceipt;
export const fFinishedERC20Web3TxReceipt = toTxReceipt(
  erc20Web3TxReceiptFinished
) as IFinishedTxReceipt;

export const fTxReceiptEIP1559 = toTxReceipt(txReceiptEIP1559) as IPendingTxReceipt;

export const fDerivedApprovalTx: DistributiveOmit<ITxObject, 'nonce' | 'gasLimit'> = {
  chainId: 1,
  data: '0x095ea7b3000000000000000000000000221657776846890989a759ba2973e427dff5c9bb0000000000000000000000000000000000000000000000004563918244f40000' as ITxData,
  from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as ITxFromAddress,
  gasPrice: '0x12a05f200' as ITxGasPrice,
  to: '0x1985365e9f78359a9B6AD760e32412f4a445E862' as ITxToAddress,
  value: '0x0' as ITxValue
};

export const fDerivedRepMigrationTx: DistributiveOmit<ITxObject, 'nonce' | 'gasLimit'> = {
  from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as ITxFromAddress,
  to: '0x221657776846890989a759BA2973e427DfF5C9bB' as ITxToAddress,
  value: '0x0' as ITxValue,
  data: '0x75d9aa1a' as ITxData,
  gasPrice: '0x12a05f200' as ITxGasPrice,
  chainId: 1
};

export const fDerivedGolemMigrationTx: DistributiveOmit<ITxObject, 'nonce' | 'gasLimit'> = {
  from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as ITxFromAddress,
  to: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d' as ITxToAddress,
  value: '0x0' as ITxValue,
  data: '0x454b06080000000000000000000000000000000000000000000000004563918244f40000' as ITxData,
  gasPrice: '0x12a05f200' as ITxGasPrice,
  chainId: 1
};

export const fSignedTx =
  '0xf86b0685012a05f20082520894b2bb2b958afa2e96dab3f3ce7162b87daea39017872386f26fc10000802aa0686df061021262b4e75eb1608c8baaf043cca2b5ac68fb24420ede62d13a8a7fa035389237414433ac06a33d95c863b8221fe2c797a9c650c47a555255be0234f3';

export const fSignedTxEIP1559 =
  '0x02f8720306843b9aca008504a817c80082520894b2bb2b958afa2e96dab3f3ce7162b87daea39017872386f26fc1000080c001a081236f9a4e0b9544d9c607954349126c1e6a57ef10b6b77d5abd605df98cf8b8a0043bb1f68170d9e21df014d65fa8cae4177bc36efd8507aa30fc3cb45d415111';
