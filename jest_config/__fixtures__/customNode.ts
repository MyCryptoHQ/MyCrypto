import { CustomNodeConfig, NodeType } from '@types';

const customNodeConfig: CustomNodeConfig = {
  name: 'eth_custom_node_1',
  service: 'Custom node 1',
  auth: {
    username: 'username',
    password: 'password'
  },
  url: 'https://custom.node.com/',
  isCustom: true,
  type: NodeType.MYC_CUSTOM,
  hidden: false
};

export default customNodeConfig;
