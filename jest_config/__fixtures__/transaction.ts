import { getAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';

import {
  IFailedTxReceipt,
  IPendingTxReceipt,
  ISuccessfulTxReceipt,
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

const toTxResponse = (fixtureTxResponse: any): TransactionResponse => ({
  ...fixtureTxResponse,
  gasPrice: BigNumber.from(fixtureTxResponse.gasPrice),
  gasLimit: BigNumber.from(fixtureTxResponse.gasLimit),
  value: BigNumber.from(fixtureTxResponse.value)
});

const toTxReceipt = (fixtureTxReceipt: any): ITxReceipt => {
  const result = {
    ...fixtureTxReceipt,
    to: getAddress(fixtureTxReceipt.to),
    from: getAddress(fixtureTxReceipt.from),
    receiverAddress: getAddress(fixtureTxReceipt.receiverAddress),
    gasPrice: BigNumber.from(fixtureTxReceipt.gasPrice),
    gasLimit: BigNumber.from(fixtureTxReceipt.gasLimit),
    value: BigNumber.from(fixtureTxReceipt.value),
    status: fixtureTxReceipt.status as ITxStatus.PENDING | ITxStatus.SUCCESS | ITxStatus.FAILED
  };
  return {
    ...result,
    ...(fixtureTxReceipt.gasUsed && { gasUsed: BigNumber.from(fixtureTxReceipt.gasUsed) })
  };
};

export const fTransaction: ITxObject = {
  to: '0x909f74Ffdc223586d0d30E78016E707B6F5a45E2' as ITxToAddress,
  value: '0x38d7ea4c68000' as ITxValue,
  data: '0x' as ITxData,
  gasLimit: '21000' as ITxGasLimit,
  gasPrice: '0xee6b2800' as ITxGasPrice,
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
export const fFinishedERC20NonWeb3TxReceipt = toTxReceipt(erc20NonWeb3TxReceiptFinished) as
  | ISuccessfulTxReceipt
  | IFailedTxReceipt;
export const fFinishedERC20Web3TxReceipt = toTxReceipt(erc20Web3TxReceiptFinished) as
  | ISuccessfulTxReceipt
  | IFailedTxReceipt;

export const fDerivedApprovalTx: Omit<ITxObject, 'nonce' | 'gasLimit'> = {
  chainId: 1,
  data: '0x095ea7b3000000000000000000000000221657776846890989a759ba2973e427dff5c9bb0000000000000000000000000000000000000000000000004563918244f40000' as ITxData,
  from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as ITxFromAddress,
  gasPrice: '0x12a05f200' as ITxGasPrice,
  to: '0x1985365e9f78359a9B6AD760e32412f4a445E862' as ITxToAddress,
  value: '0x0' as ITxValue
};

export const fDerivedRepMigrationTx: Omit<ITxObject, 'nonce' | 'gasLimit'> = {
  from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as ITxFromAddress,
  to: '0x221657776846890989a759BA2973e427DfF5C9bB' as ITxToAddress,
  value: '0x0' as ITxValue,
  data: '0x75d9aa1a' as ITxData,
  gasPrice: '0x12a05f200' as ITxGasPrice,
  chainId: 1
};

export const fDerivedGolemMigrationTx: Omit<ITxObject, 'nonce' | 'gasLimit'> = {
  from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as ITxFromAddress,
  to: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d' as ITxToAddress,
  value: '0x0' as ITxValue,
  data: '0x454b06080000000000000000000000000000000000000000000000004563918244f40000' as ITxData,
  gasPrice: '0x12a05f200' as ITxGasPrice,
  chainId: 1
};
