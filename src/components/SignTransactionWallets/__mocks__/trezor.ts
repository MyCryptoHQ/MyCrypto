export const mockFactory = (
  publicKey: string,
  chainCode: number,
  signResult: { v: number; r: number; s: number }
) => ({
  manifest: jest.fn(),
  // Mock getPublicKey, use bogus publicKey and valid chaincode - return as a promise to match Trezor API
  getPublicKey: jest.fn().mockImplementation(() =>
    Promise.resolve({
      payload: {
        publicKey,
        chainCode
      },
      success: true
    })
  ),
  // Mock signing result from Trezor device, device only returns v,r,s values - return as a promise to match Trezor API
  ethereumSignTransaction: jest
    .fn()
    .mockImplementation(() => Promise.resolve({ payload: signResult, success: true }))
});
