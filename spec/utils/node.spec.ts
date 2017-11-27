import {
  makeCustomNodeId,
  getCustomNodeConfigFromId,
  getNodeConfigFromId,
  makeNodeConfigFromCustomConfig
} from 'utils/node';

const custNode = {
  name: 'Test Config',
  url: 'http://somecustomconfig.org/',
  port: 443,
  network: 'ETH'
};
const custNodeId = 'http://somecustomconfig.org/:443';

describe('makeCustomNodeId', () => {
  it('should construct an ID from url:port', () => {
    expect(makeCustomNodeId(custNode) === custNodeId).toBeTruthy();
  });
});

describe('getCustomNodeConfigFromId', () => {
  it('should fetch the correct config, given its ID', () => {
    expect(getCustomNodeConfigFromId(custNodeId, [custNode])).toBeTruthy();
  });
});

describe('getNodeConfigFromId', () => {
  it('should fetch the correct config, given its ID', () => {
    expect(getNodeConfigFromId(custNodeId, [custNode])).toBeTruthy();
  });
});

describe('makeNodeConfigFromCustomConfig', () => {
  it('Should create a node config from a custom config', () => {
    expect(makeNodeConfigFromCustomConfig(custNode)).toBeTruthy();
  });
});
