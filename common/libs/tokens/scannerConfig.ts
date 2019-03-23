interface ScannerConfig {
  networks: string[];
  address: string;
  hash: string;
}

const config: ScannerConfig[] = [
  {
    networks: ['ETH', 'WEB3_ETH'],
    address: '0x976A8799E101F24535178ED25f92d3836Bf1D2E5',
    hash: 'b469bca73c4d9ee0fe20e65ef552e0ecda062a3efbb596f8d6be3a32301e54f1'
  }
];

export default config;
