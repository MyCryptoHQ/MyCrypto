import { ITxConfig } from '@types';

export const mockFactory = (txConfig: ITxConfig) => {
  const ethersUtils = jest.requireActual('ethers/utils');
  return {
    ...ethersUtils,
    parseTransaction: () => ({
      gasPrice: txConfig.gasPrice,
      gasLimit: txConfig.gasLimit,
      value: txConfig.value,
      nonce: txConfig.nonce,
      data: txConfig.data,
      to: txConfig.receiverAddress
    })
  };
};
