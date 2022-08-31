export const mockFactory = (validHash: string) => {
  const txResponse = {
    hash: '0x5b8bd3deca986e4c6aa4acc561c32314a0c32c2292be95b739ee76db022cfba8',
    blockHash: null,
    blockNumber: null,
    transactionIndex: null,
    confirmations: 0,
    from: '0x5197B5b062288Bbf29008C92B08010a92Dd677CD',
    gasPrice: '0x012a05f200',
    gasLimit: '0x7d3c',
    to: '0x5197B5b062288Bbf29008C92B08010a92Dd677CD',
    value: '0x00',
    nonce: 24,
    data: '0x',
    r: '0xf59ba7d53009466f5acc79fc76a51818107c3ff3d8340ce91a1c99f272854104',
    s: '0x1336d15b3ea9e66458d94d71a2a5bee498c176edb79e97c6ed12f2e47b74fac6',
    v: 42,
    creates: null,
    raw:
      '0xf86b1885012a05f200825208945197b5b062288bbf29008c92b08010a92dd677cd872386f26fc10000802aa0f59ba7d53009466f5acc79fc76a51818107c3ff3d8340ce91a1c99f272854104a01336d15b3ea9e66458d94d71a2a5bee498c176edb79e97c6ed12f2e47b74fac6',
    networkId: 3,
    chainId: 3
  };
  return {
    FallbackProvider: jest.fn().mockImplementation(() => ({
      waitForTransaction: jest.fn().mockResolvedValue(txResponse),
      providers: [
        {
          getTransaction: jest
            .fn()
            .mockImplementation((hash) =>
              hash === validHash ? Promise.resolve(txResponse) : Promise.resolve(undefined)
            )
        }
      ]
    }))
  };
};
