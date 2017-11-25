import { NODES, NodeConfig } from '../../common/config/data';
import { RPCNode } from '../../common/libs/nodes';
import { Validator } from 'jsonschema';
import { schema } from '../../common/libs/validators';
import 'url-search-params-polyfill';
import EtherscanNode from 'libs/nodes/etherscan';
import InfuraNode from 'libs/nodes/infura';

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

const testGetBalance = async (n: RPCNode) => {
  const data = await n.client.call(
    n.requests.getBalance(validRequests.address)
  );
  return v.validate(data, schema.RpcNode);
};

const testEstimateGas = async (n: RPCNode) => {
  const data = await n.client.call(
    n.requests.estimateGas(validRequests.transaction)
  );
  return v.validate(data, schema.RpcNode);
};

const testGetTokenBalance = async (n: RPCNode) => {
  const { address, token } = validRequests;
  const data = await n.client.call(n.requests.getTokenBalance(address, token));
  return v.validate(data, schema.RpcNode);
};

const RPCTests = {
  getBalance: testGetBalance,
  estimateGas: testEstimateGas,
  getTokenBalance: testGetTokenBalance
};

function testRpcRequests(node: RPCNode, service: string) {
  Object.keys(RPCTests).forEach(testType => {
    describe(`RPC (${service}) should work`, () => {
      it(`RPC: ${testType} ${service}`, () => {
        return RPCTests[testType](node).then(d => expect(d.valid).toBeTruthy());
      });
    });
  });
}

const mapNodeEndpoints = (nodes: { [key: string]: NodeConfig }) => {
  const RpcNodeList = ['eth_mew', 'etc_epool', 'etc_epool', 'rop_mew'];

  const EthscanNodeList = ['eth_ethscan', 'kov_ethscan', 'rin_ethscan'];

  const InfuraNodeList = ['eth_infura', 'rop_infura', 'rin_infura'];

  RpcNodeList.forEach(n => {
    testRpcRequests(
      nodes[n].lib as RPCNode,
      `${nodes[n].service} ${nodes[n].network}`
    );
  });

  EthscanNodeList.forEach(n => {
    testRpcRequests(
      nodes[n].lib as EtherscanNode,
      `${nodes[n].service} ${nodes[n].network}`
    );
  });

  InfuraNodeList.forEach(n => {
    testRpcRequests(
      nodes[n].lib as InfuraNode,
      `${nodes[n].service} ${nodes[n].network}`
    );
  });
};

mapNodeEndpoints(NODES);
