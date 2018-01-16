import { NODES, NodeConfig } from '../../common/config/data';
import { RPCNode } from '../../common/libs/nodes';
import { Validator } from 'jsonschema';
import { schema } from '../../common/libs/validators';
import 'url-search-params-polyfill';
import EtherscanNode from 'libs/nodes/etherscan';
import InfuraNode from 'libs/nodes/infura';
import RpcNodeTestConfig from './RpcNodeTestConfig';

const v = new Validator();

const validRequests = {
  address: '0x72948fa4200d10ffaa7c594c24bbba6ef627d4a3',
  transaction: {
    data: '',
    from: '0x72948fa4200d10ffaa7c594c24bbba6ef627d4a3',
    to: '0x72948fa4200d10ffaa7c594c24bbba6ef627d4a3',
    value: '0xde0b6b3a7640000'
  },
  token: {
    address: '0x4156d3342d5c385a87d264f90653733592000581',
    symbol: 'SALT',
    decimal: 8
  }
};

const testGetBalance = (n: RPCNode) => {
  return n.client
    .call(n.requests.getBalance(validRequests.address))
    .then(data => v.validate(data, schema.RpcNode));
};

const testEstimateGas = (n: RPCNode) => {
  return n.client
    .call(n.requests.estimateGas(validRequests.transaction))
    .then(data => v.validate(data, schema.RpcNode));
};

const testGetTokenBalance = (n: RPCNode) => {
  const { address, token } = validRequests;
  return n.client
    .call(n.requests.getTokenBalance(address, token))
    .then(data => v.validate(data, schema.RpcNode));
};

const RPCTests = {
  getBalance: testGetBalance,
  estimateGas: testEstimateGas,
  getTokenBalance: testGetTokenBalance
};

function testRpcRequests(node: RPCNode, service: string) {
  Object.keys(RPCTests).forEach(testType => {
    describe(`RPC (${service}) should work`, () => {
      it(
        `RPC: ${testType} ${service}`,
        () => {
          return RPCTests[testType](node).then(d => expect(d.valid).toBeTruthy());
        },
        10000
      );
    });
  });
}

const mapNodeEndpoints = (nodes: { [key: string]: NodeConfig }) => {
  const { RpcNodes, EtherscanNodes, InfuraNodes } = RpcNodeTestConfig;

  RpcNodes.forEach(n => {
    testRpcRequests(nodes[n].lib as RPCNode, `${nodes[n].service} ${nodes[n].network}`);
  });

  EtherscanNodes.forEach(n => {
    testRpcRequests(nodes[n].lib as EtherscanNode, `${nodes[n].service} ${nodes[n].network}`);
  });

  InfuraNodes.forEach(n => {
    testRpcRequests(nodes[n].lib as InfuraNode, `${nodes[n].service} ${nodes[n].network}`);
  });
};

mapNodeEndpoints(NODES);
