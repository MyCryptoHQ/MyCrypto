import { NODES, NodeConfig } from '../../common/config/data';
import { RPCNode } from '../../common/libs/nodes';
import { Validator } from 'jsonschema';
import { schema } from '../../common/libs/validators';
import 'url-search-params-polyfill';

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

function testRequests(node: RPCNode, service: string) {
  Object.keys(RPCTests).forEach(testType => {
    describe('RPC getBalance should work', () => {
      it(`RPC: ${testType} ${service}`, () => {
        return RPCTests[testType](node).then(d => expect(d.valid).toBeTruthy());
      });
    });
  });
}

const mapNodeEndpoints = (nodes: { [key: string]: NodeConfig }) => {
  const testList = ['eth_mew', 'etc_epool'];
  testList.forEach(n => {
    testRequests(
      nodes[n].lib as RPCNode,
      `${nodes[n].service} ${nodes[n].network}`
    );
  });
};

mapNodeEndpoints(NODES);
