import { TAddress, Web3RequestPermissionsResponse } from '@types';

export const RequestPermissionsReturn: Web3RequestPermissionsResponse = {
  id: '5a99d4d1f5bd9113ddeb3a699fc2dc1e',
  jsonrpc: '2.0',
  result: [
    {
      '@context': ['https://github.com/MetaMask/rpc-cap'],
      invoker: 'https://localhost:3000',
      parentCapability: 'eth_accounts',
      id: '57d5bb99-9b99-437e-bbec-9bbb999bacf8',
      date: 1250000000000,
      caveats: [
        {
          type: 'limitResponseLength',
          value: 1,
          name: 'primaryAccountOnly'
        },
        {
          type: 'filterResponse',
          value: ['0x5197b5b062288bbf29008c92b08010a92dd677cd' as TAddress],
          name: 'exposedAccounts'
        }
      ]
    }
  ]
};
