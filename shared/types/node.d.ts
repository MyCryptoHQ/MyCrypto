import { RPCNode, Web3Node } from 'libs/nodes';
import { StaticNetworkIds } from './network';
import { StaticNodesState, CustomNodesState } from 'reducers/config/nodes';
import CustomNode from 'libs/nodes/custom';

interface CustomNodeConfig {
  id: string;
  isCustom: true;
  name: string;
  lib: CustomNode;
  service: 'your custom node';
  url: string;
  port: number;
  network: string;
  auth?: {
    username: string;
    password: string;
  };
}

interface StaticNodeConfig {
  isCustom: false;
  network: StaticNetworkIds;
  lib: RPCNode | Web3Node;
  service: string;
  estimateGas?: boolean;
  hidden?: boolean;
}

interface Web3NodeConfig extends StaticNodeConfig {
  lib: Web3Node;
}

declare enum StaticNodeId {
  ETH_MYCRYPTO = 'eth_mycrypto',
  ETH_ETHSCAN = 'eth_ethscan',
  ETH_INFURA = 'eth_infura',
  ETH_BLOCKSCALE = 'eth_blockscale',
  ROP_INFURA = 'rop_infura',
  KOV_ETHSCAN = 'kov_ethscan',
  RIN_ETHSCAN = 'rin_ethscan',
  RIN_INFURA = 'rin_infura',
  ETC_EPOOL = 'etc_epool',
  UBQ = 'ubq',
  EXP_TECH = 'exp_tech'
}

type StaticNodeWithWeb3Id = StaticNodeId | 'web3';

type NonWeb3NodeConfigs = { [key in StaticNodeId]: StaticNodeConfig };

interface Web3NodeConfigs {
  web3?: Web3NodeConfig;
}

type NodeConfig = StaticNodesState[StaticNodeId] | CustomNodesState[string];
