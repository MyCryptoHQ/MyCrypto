export const mockFactory = (
  publicKey: string,
  chainCode: number,
  signResult: { v: number; r: number; s: number }
) => {
  return jest.fn().mockImplementation(() => ({
    // Mock getAddress with bogus public key and valid chain code
    getAddress: jest.fn().mockImplementation(() => ({
      publicKey,
      chainCode
    })),
    // Mock signing result from Ledger device, device only returns v,r,s values - return as a promise to match Ledger API
    signTransaction: jest.fn().mockImplementation(() => Promise.resolve(signResult))
  }));
};
