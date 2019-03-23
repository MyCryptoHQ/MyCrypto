import Contract from 'libs/contracts';

const tokenScannerABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      },
      {
        name: '_contracts',
        type: 'address[]'
      }
    ],
    name: 'scanTokens',
    outputs: [
      {
        name: '',
        type: 'uint256[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];

export default new Contract(tokenScannerABI);
