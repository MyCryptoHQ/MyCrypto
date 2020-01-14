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

type NodeConfig = StaticNodeConfig | CustomNodeConfig;
