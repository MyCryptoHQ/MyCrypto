export const mockFactory = (signResult: string) => {
  return {
    Wallet: jest.fn().mockImplementation(() => ({
      sign: jest.fn().mockImplementation(() => Promise.resolve(signResult))
    }))
  };
};
