import { ITxConfig } from '@types';

export const mockFactory = (txConfig: ITxConfig) => {
  const ethersTransactions = jest.requireActual('@ethersproject/transactions');
  return {
    ...ethersTransactions,
    parse: () => ({
      gasPrice: txConfig.rawTransaction.gasPrice,
      gasLimit: txConfig.rawTransaction.gasLimit,
      value: txConfig.rawTransaction.value,
      nonce: txConfig.rawTransaction.nonce,
      data: txConfig.rawTransaction.data,
      to: txConfig.receiverAddress
    })
  };
};
