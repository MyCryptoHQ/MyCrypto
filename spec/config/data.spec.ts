import { NODES, NodeConfig } from '../../common/config/data';
import { RPCNode } from '../../common/libs/nodes';
import { Validator } from 'jsonschema';
import { schema } from '../../common/libs/validators';
import 'url-search-params-polyfill';

const v = new Validator();

const validRequests = {
  address: '0x6b3a639eb96d8e0241fe4e114d99e739f906944e',
  txObject: {}
};

const testGetBalance = async (n: RPCNode) => {
  const data = await n.client.call(
    n.requests.getBalance(validRequests.address)
  );
  return v.validate(data, schema.getBalance);
};

const RPCTests = {
  getBalance: testGetBalance
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
  const testList = ['eth_mew', 'eth_ethscan', 'etc_epool'];
  testList.forEach(n => {
    testRequests(nodes[n].lib, `${nodes[n].service} ${nodes[n].network}`);
  });
};

mapNodeEndpoints(NODES);
