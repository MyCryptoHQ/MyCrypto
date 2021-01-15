import { bufferToHex } from 'ethereumjs-util';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';

import { getAssetByUUID } from '@services';
import { AbiFunction } from '@services/EthService/contracts/ABIFunction';
import { ITxConfig, ITxObject, StoreAccount } from '@types';
import { hexToString, hexWeiToString, inputValueToHex } from '@utils';

import { ABIItem, ABIItemType, StateMutabilityType } from './types';

export const isReadOperation = (abiFunction: ABIItem): boolean => {
  const { stateMutability } = abiFunction;

  if (stateMutability) {
    return (
      stateMutability === StateMutabilityType.PURE || stateMutability === StateMutabilityType.VIEW
    );
  } else {
    return !!abiFunction.constant;
  }
};

export const isPayable = (abiFunction: ABIItem): boolean => {
  const { stateMutability } = abiFunction;
  return stateMutability ? stateMutability === StateMutabilityType.PAYABLE : !!abiFunction.payable;
};

export const generateFunctionFieldsDisplayNames = (abiFunction: ABIItem) => {
  const tempFunction = cloneDeep(abiFunction);

  tempFunction.inputs.forEach((input, index) => {
    if (input.displayName) {
      return;
    }

    if (input.name === '') {
      input.name = index.toString();
      input.displayName = `Input#${index}`;
    } else {
      input.displayName = input.name;
    }
  });

  tempFunction.outputs.forEach((output, index) => {
    if (output.displayName) {
      return;
    }

    if (output.name === '') {
      output.name = index.toString();
      output.displayName = `Output#${index}`;
    } else {
      output.displayName = output.name;
    }
  });

  tempFunction.payAmount = '0';
  return tempFunction;
};

export const setFunctionOutputValues = (abiFunction: ABIItem, outputValues: any) => {
  const tempFunction = cloneDeep(abiFunction);

  tempFunction.outputs.forEach((output) => {
    let outputValue = outputValues[output.name];
    if (Buffer.isBuffer(outputValue)) {
      outputValue = bufferToHex(outputValue);
    }

    output.value = outputValue;
  });

  return tempFunction;
};

export const getFunctionsFromABI = (pAbi: ABIItem[]) =>
  sortBy(
    pAbi.filter((x) => x.type === ABIItemType.FUNCTION),
    (item) => item.name.toLowerCase()
  ).map((x) => Object.assign(x, { label: x.name }));

export const makeContractInteractionTxConfig = (
  rawTransaction: ITxObject,
  account: StoreAccount,
  amount: string
): ITxConfig => {
  const { gasPrice, gasLimit, nonce, data, to, value } = rawTransaction;
  const { address, network } = account;
  const baseAsset = getAssetByUUID(account.assets)(network.baseAsset)!;

  const txConfig: ITxConfig = {
    from: address,
    amount,
    receiverAddress: to,
    senderAccount: account,
    network,
    asset: baseAsset,
    baseAsset,
    gasPrice: hexToString(gasPrice),
    gasLimit,
    value: hexWeiToString(value),
    nonce,
    data,
    rawTransaction
  };

  return txConfig;
};

export const reduceInputParams = (submitedFunction: ABIItem) =>
  submitedFunction.inputs.reduce((accu, input) => {
    let inputValue = input.value;
    if (inputValue && ['[', ']'].every((x) => input.type.includes(x))) {
      inputValue = JSON.parse(inputValue);
    }

    return { ...accu, [input.name]: input.value };
  }, {});

export const constructGasCallProps = (
  contractAddress: string,
  currentFunction: ABIItem,
  account: StoreAccount
) => {
  try {
    const { encodeInput } = new AbiFunction(currentFunction, []);
    const parsedInputs = reduceInputParams(currentFunction);
    const data = encodeInput(parsedInputs);

    return {
      from: account.address,
      to: contractAddress,
      value: inputValueToHex(currentFunction.payAmount),
      data
    };
  } catch (e) {
    return {};
  }
};
