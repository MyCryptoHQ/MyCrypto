import { StaticNetworkIds } from './network';

interface CustomNodeConfig {
  id: string;
  isCustom: true;
  isAuto?: undefined;
  name: string;
  service: 'your custom node';
  url: string;
  network: string;
  auth?: {
    username: string;
    password: string;
  };
}

interface StaticNodeConfig {
  id: string;
  isCustom: false;
  isAuto?: boolean;
  network: StaticNetworkIds;
  service: string;
  hidden?: boolean;
}

interface RawNodeConfig {
  name: string;
  type: 'rpc' | 'etherscan' | 'infura' | 'web3' | 'myccustom';
  service: string;
  url: string;
}

type StaticNodeId = string;

type StaticNodeConfigs = { [id: string]: StaticNodeConfig } & { web3?: StaticNodeConfig };

type NodeConfig = StaticNodeConfig | CustomNodeConfig;
