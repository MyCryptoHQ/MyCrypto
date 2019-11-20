import { sortBy, cloneDeep } from 'lodash';
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

  return tempFunction;
};

export const setFunctionOutputValues = (abiFunction: ABIItem, outputValues: any) => {
  const tempFunction = cloneDeep(abiFunction);

  tempFunction.outputs.forEach(output => {
    output.value = outputValues[output.name];
  });

  return tempFunction;
};

export const getFunctionsFromABI = (pAbi: ABIItem[]) =>
  sortBy(pAbi.filter(x => x.type === ABIItemType.FUNCTION), item => item.name.toLowerCase()).map(
    x => Object.assign(x, { label: x.name })
  );
