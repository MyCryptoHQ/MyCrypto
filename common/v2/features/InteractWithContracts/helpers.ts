import { sortBy } from 'lodash';
import { StateMutabilityType, ABIItem, ABIItemType } from './types';

export const isReadOperation = (abiFunction: ABIItem) => {
  const { stateMutability } = abiFunction;

  if (stateMutability) {
    return (
      stateMutability === StateMutabilityType.PURE || stateMutability === StateMutabilityType.VIEW
    );
  } else {
    return !!abiFunction.constant;
  }
};

export const generateFunctionInputDisplayNames = (abiFunction: ABIItem) => {
  const tempFunction = Object.assign({}, abiFunction);

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

  return tempFunction;
};

export const getFunctionsFromABI = (pAbi: ABIItem[]) => {
  return sortBy(pAbi.filter(x => x.type === ABIItemType.FUNCTION), item => {
    return item.name.toLowerCase();
  });
};
