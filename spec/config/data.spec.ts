import { NODES } from '../../common/config/data';
import { RPCNode } from '../../common/libs/nodes';
import { Validator } from 'jsonschema';

const v = new Validator();

const schema = {
  getBalance: {
    jsonrpc: 'string',
    id: 'integer',
    params: 'array'
  }
};
const validRequests = {
  address: '0x6b3a639eb96d8e0241fe4e114d99e739f906944e',
  txObject: {}
};

const testGetBalance = async (n: RPCNode) => {
  const data = await n.client.call(
    this.requests.getBalance(validRequests.address)
  );
  return v.validate(data, schema.getBalance);
};

const RPCTests = {
  getBalance: testGetBalance
};

function testRequests(node: RPCNode) {
  let result = true;
  Object.keys(RPCTests).forEach(c => {
    const testBool = RPCTests[c](node);
    if (!testBool && result) {
      result = false;
    }
  });
  return result;
}

describe('RPC Nodes', () => {
  it('should be able to get balance', () => {
    expect(testRequests(NODES.eth_mew.lib)).toBeTruthy();
  });
});
