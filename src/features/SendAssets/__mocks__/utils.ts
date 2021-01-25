import { ITxConfig } from '@types';

export const mockFactory = (txConfig: ITxConfig) => {
  const ethersTransactions = jest.requireActual('@ethersproject/transactions');
  return {
    ...ethersTransactions,
    parse: () => ({
      gasPrice: txConfig.gasPrice,
      gasLimit: txConfig.gasLimit,
      value: txConfig.value,
      nonce: txConfig.nonce,
      data: txConfig.data,
      to: txConfig.receiverAddress
    })
  };
};
