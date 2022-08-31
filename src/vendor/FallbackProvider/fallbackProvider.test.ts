import { StaticJsonRpcProvider } from '@ethersproject/providers';
import nock from 'nock';

import { map, pipe } from '@vendor';

import { FallbackProvider } from './fallbackProvider';

const nodes = [
  'http://first.example.com/first',
  'http://second.example.com/second',
  'http://third.example.com/third'
];

const createFallbackProvider = ({ nodes, chainId }: { nodes: string[]; chainId: number }) =>
  pipe(
    map((nodeUrl: string) => new StaticJsonRpcProvider(nodeUrl, chainId)),
    (providers) => new FallbackProvider(providers)
  )(nodes);

describe('FallbackProvider', () => {
  nock.disableNetConnect();

  afterEach(() => {
    nock.cleanAll();
  });

  it('performs request', async () => {
    nock(nodes[0])
      .post(/.*/)
      .reply(200, () => {
        return {
          id: 83,
          jsonrpc: '2.0',
          result: '0x79A32F' // 7971631
        };
      });

    const provider = createFallbackProvider({
      nodes,
      chainId: 42
    });

    const expected = 7971631;
    const actual = await provider.getBlockNumber();
    expect(expected).toBe(actual);
  });

  it('falls back on subsequent provider when first fails', async () => {
    const scope1 = nock(nodes[0]).post(/.*/).reply(400, {
      id: 83,
      jsonrpc: '2.0',
      result: '0x0' // 0
    });

    const scope2 = nock(nodes[1]).post(/.*/).reply(200, {
      id: 83,
      jsonrpc: '2.0',
      result: '0x7832F' // 492335
    });

    const provider = createFallbackProvider({
      nodes,
      chainId: 32
    });

    const res = await provider.getBlockNumber();
    expect(res).toEqual(492335);
    expect(scope1.isDone()).toBe(true);
    expect(scope2.isDone()).toBe(true);
  });

  it('uses first valid response', async () => {
    const scope1 = nock(nodes[0]).post(/.*/).reply(200, {
      id: 83,
      jsonrpc: '2.0',
      result: '0x0' // 0
    });

    const scope2 = nock(nodes[1]).post(/.*/).reply(200, {
      id: 83,
      jsonrpc: '2.0',
      result: '0x7832F' // 492335
    });

    const provider = createFallbackProvider({
      nodes,
      chainId: 32
    });

    const res = await provider.getBlockNumber();
    expect(res).toEqual(0);
    expect(scope1.isDone()).toBe(true);
    expect(scope2.isDone()).toBe(false);
  });
});
