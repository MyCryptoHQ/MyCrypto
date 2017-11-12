import { NODES, NodeConfig } from '../../common/config/data';
import { RPCNode } from '../../common/libs/nodes';
import { Validator } from 'jsonschema';
import 'url-search-params-polyfill';

const v = new Validator();

const schema = {
  getBalance: {
    type: 'object',
    additionalProperties: false,
    properties: {
      jsonrpc: { type: 'string' },
      id: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
      result: { type: 'string' },
      status: { type: 'string' },
      message: { type: 'string' }
    }
  }
};
const validRequests = {
  address: '0x6b3a639eb96d8e0241fe4e114d99e739f906944e',
  txObject: {}
};

const testGetBalance = async (n: RPCNode, service: string) => {
  const data = await n.client.call(
    n.requests.getBalance(validRequests.address)
  );
  console.log(service, data);
  return v.validate(data, schema.getBalance);
};

const RPCTests = {
  getBalance: testGetBalance
};

function testRequests(node: RPCNode, service: string) {
  Object.keys(RPCTests).forEach(testType => {
    describe('RPC getBalance should work', () => {
      it(`RPC: ${testType} ${service}`, () => {
        return RPCTests[testType](node, service).then(d =>
          expect(d.valid).toBeTruthy()
        );
      });
    });
  });
}

const mapNodeEndpoints = (nodes: { [key: string]: NodeConfig }) => {
  const testList = ['eth_mew', 'eth_ethscan', 'eth_infura', 'etc_epool'];
  testList.forEach(n => {
    testRequests(nodes[n].lib, `${nodes[n].service} ${nodes[n].network}`);
  });
};

mapNodeEndpoints(NODES);
