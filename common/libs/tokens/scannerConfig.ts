interface ScannerConfig {
  networks: string[];
  address: string;
}

const config: ScannerConfig[] = [
  {
    networks: ['ETH', 'WEB3_ETH'],
    address: '0x657bEdAFb6BddbEDB8F930d7f91a5AF765B42Ba2'
  }
];

export default config;
