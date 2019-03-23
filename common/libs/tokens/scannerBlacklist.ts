interface BlacklistEntry {
  networks: string[];
  address: string;
  description: string;
}

const blacklist: BlacklistEntry[] = [
  {
    networks: ['ETH', 'WEB3_ETH'],
    address: '0x105d97ef2E723f1cfb24519Bc6fF15a6D091a3F1',
    description: 'Selfdestructed'
  },
  {
    networks: ['ETH', 'WEB3_ETH'],
    address: '0x2a3Aa9ECA41E720Ed46B5A70D6C37EfA47f768Ac',
    description: 'Empty'
  },
  {
    networks: ['ETH', 'WEB3_ETH'],
    address: '0x2108E62D335Bbdc89eC3E9d8582F18DCFB0cDFf4',
    description: 'Empty'
  },
  {
    networks: ['ETH', 'WEB3_ETH'],
    address: '0x523630976eB6147621B5c31c781eBe2Ec2a806E0',
    description: 'Selfdestructed'
  },
  {
    networks: ['ETH', 'WEB3_ETH'],
    address: '0x8F936fE0faF0604c9C0Ef2406bde0A65365515d6',
    description: 'Broken'
  },
  {
    networks: ['ETH', 'WEB3_ETH'],
    address: '0xC011A72400E58ecD99Ee497CF89E3775d4bd732F',
    description: 'Broken'
  },
  {
    networks: ['ETH', 'WEB3_ETH'],
    address: '0x57Ab1E02fEE23774580C119740129eAC7081e9D3',
    description: 'Broken'
  },
  {
    networks: ['ETH', 'WEB3_ETH'],
    address: '0x1ed2B1eaEd8e968bc36EB90a914660A71827A5E9',
    description: 'Broken'
  },
  {
    networks: ['ETH', 'WEB3_ETH'],
    address: '0x614b9802D45Aa1bC2282651dC1408632F9027A6e',
    description: 'Invalid'
  }
];

export default blacklist;
