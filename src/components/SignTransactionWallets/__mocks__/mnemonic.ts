export const mockFactory = (address: string, signResult: string) => {
  return {
    Wallet: {
      fromMnemonic: jest.fn().mockImplementation(() =>
        Promise.resolve({
          address,
          sign: jest.fn().mockImplementation(() => Promise.resolve(signResult))
        })
      )
    },
    utils: {
      getAddress: jest.fn().mockImplementation(() => address)
    }
  };
};
