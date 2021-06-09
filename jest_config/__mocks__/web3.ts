export const mockWindow = (customWindow: CustomWindow) => {
  // Mock window.ethereum
  customWindow.ethereum = {
    enable: jest.fn().mockImplementation(() => Promise.resolve({})),
    on: jest.fn(),
    removeAllListeners: jest.fn()
  };
};

export const mockFactory = (address: string, chainId: number, signResult: string) => {
  const mockGetSigner = jest.fn().mockImplementation(() => ({
    getAddress: mockGetAddress,
    sendUncheckedTransaction: mockSend
  }));
  const mockGetAddress = jest.fn().mockImplementation(() => address);
  const mockGetNetwork = jest.fn().mockImplementation(() => ({ chainId }));
  const mockSend = jest.fn().mockImplementation(() => Promise.resolve(signResult));
  return {
    Web3Provider: jest.fn().mockImplementation(() => ({
      getSigner: mockGetSigner,
      getNetwork: mockGetNetwork
    }))
  };
};
