import { Validator, ValidatorResult } from 'jsonschema';
import { schema } from '../../common/libs/validators';
import 'url-search-params-polyfill';
import INodeTestConfig from './RpcNodeTestConfig';
import { StaticNodeConfig } from 'types/node';
import { staticNodesExpectedState } from 'features/config/nodes/static/reducer.spec';
import { INode, shepherd, shepherdProvider } from 'libs/nodes';

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

interface RPCTestList {
  [key: string]: ((n: INode) => Promise<ValidatorResult>);
}

const testGetBalance = (n: INode) => {
  return n.getBalance(validRequests.address).then(data => v.validate(data, schema.RpcNode));
};

const testEstimateGas = (n: INode) => {
  return n.estimateGas(validRequests.transaction).then(data => v.validate(data, schema.RpcNode));
};

const testGetTokenBalance = (n: INode) => {
  const { address, token } = validRequests;
  return n.getTokenBalance(address, token).then(data => v.validate(data, schema.RpcNode));
};

const RPCTests: RPCTestList = {
  getBalance: testGetBalance,
  estimateGas: testEstimateGas,
  getTokenBalance: testGetTokenBalance
};

function testRpcRequests(node: INode, service: string) {
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

const mapNodeEndpoints = (nodes: { [key: string]: StaticNodeConfig }) => {
  const { RpcNodes } = INodeTestConfig;

  RpcNodes.forEach((n: string) => {
    shepherd.manual(n, true);
    testRpcRequests(shepherdProvider, `${nodes[n].service} ${nodes[n].network}`);
  });
};

mapNodeEndpoints((staticNodesExpectedState.initialState as any) as {
  [key: string]: StaticNodeConfig;
});
