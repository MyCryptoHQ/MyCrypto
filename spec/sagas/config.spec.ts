import { delay } from 'redux-saga';
import { call, cancel, fork, put, take, select } from 'redux-saga/effects';
import { cloneableGenerator, createMockTask } from 'redux-saga/utils';
import {
  toggleOfflineConfig,
  changeNode,
  changeNodeIntent
} from 'actions/config';
import {
  getConfig,
  pollOfflineStatus,
  handlePollOfflineStatus,
  handleNodeChangeIntent,
  reload,
  unsetWeb3Node,
  equivalentNodeOrDefault
} from 'sagas/config';
import { NODES } from 'config/data';
import { getNode, getNodeConfig } from 'selectors/config';
import { INITIAL_STATE as configInitialState } from 'reducers/config';
import { getWalletInst } from 'selectors/wallet';
import { Web3Wallet } from 'libs/wallet';
import { RPCNode } from 'libs/nodes';

describe('pollOfflineStatus*', () => {
  const gen = pollOfflineStatus();

  it('should select getConfig', () => {
    expect(gen.next().value).toEqual(select(getConfig));
  });

  it('should put toggleOfflineConfig', () => {
    expect(gen.next({ offline: true }).value).toEqual(
      put(toggleOfflineConfig())
    );
  });

  it('should call delay', () => {
    expect(gen.next().value).toEqual(call(delay, 250));
  });
});

describe('handlePollOfflineStatus*', () => {
  const gen = handlePollOfflineStatus();
  const mockTask = createMockTask();

  it('should fork pollOffineStatus', () => {
    const expectedForkYield = fork(pollOfflineStatus);
    expect(gen.next().value).toEqual(expectedForkYield);
  });

  it('should take CONFIG_STOP_POLL_OFFLINE_STATE', () => {
    expect(gen.next(mockTask).value).toEqual(
      take('CONFIG_STOP_POLL_OFFLINE_STATE')
    );
  });

  it('should cancel pollOfflineStatus', () => {
    expect(gen.next().value).toEqual(cancel(mockTask));
  });
});

describe('handleNodeChangeIntent*', () => {
  const defaultNode = configInitialState.nodeSelection;
  const defaultNodeConfig = NODES[defaultNode];
  const newNode = Object.keys(NODES).reduce(
    (acc, cur) => (NODES[acc].network === defaultNodeConfig.network ? cur : acc)
  );
  const changeNodeAction = changeNode(newNode);
  const falsyWallet = false;
  const truthyWallet = true;

  const data = {} as any;
  data.gen = cloneableGenerator(handleNodeChangeIntent)(changeNodeAction);

  it('should select node config', () => {
    expect(data.gen.next().value).toEqual(select(getNodeConfig));
  });

  it('should put changeNode with new node', () => {
    expect(data.gen.next(defaultNodeConfig).value).toEqual(
      put(changeNode(changeNodeAction.payload))
    );
  });

  it('should select wallet instance', () => {
    expect(data.gen.next().value).toEqual(select(getWalletInst));
  });

  it('should end if wallet is falsy', () => {
    data.clone = data.gen.clone();
    expect(data.gen.next(falsyWallet).done).toEqual(true);
  });

  it('should call reload if wallet is truthy and network is new', () => {
    expect(data.clone.next(truthyWallet).value).toEqual(call(reload));
  });

  it('should be done', () => {
    expect(data.clone.next().done).toEqual(true);
  });
});

describe('unsetWeb3Node*', () => {
  const fakeAction = {};
  const mockNode = 'web3';
  const mockNodeConfig = { network: 'ETH' };
  const gen = unsetWeb3Node(fakeAction);

  it('should select getNode', () => {
    expect(gen.next().value).toEqual(select(getNode));
  });

  it('should select getNodeConfig', () => {
    expect(gen.next(mockNode).value).toEqual(select(getNodeConfig));
  });

  it('should put changeNodeIntent', () => {
    expect(gen.next(mockNodeConfig).value).toEqual(
      put(changeNodeIntent(equivalentNodeOrDefault(mockNodeConfig)))
    );
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });

  it('should return early if node type is not web3', () => {
    const gen1 = unsetWeb3Node({ payload: false });
    gen1.next(); //getNode
    gen1.next('notWeb3'); //getNodeConfig
    expect(gen1.next().done).toEqual(true);
  });

  it('should return early if wallet type is web3', () => {
    const mockWeb3 = {};
    const mockAddress = '0x0';
    const mockNetwork = 'ETH';
    const mockWeb3Wallet = new Web3Wallet(mockWeb3, mockAddress, mockNetwork);
    const gen2 = unsetWeb3Node({ payload: mockWeb3Wallet });
    gen2.next(); //getNode
    gen2.next('web3'); //getNodeConfig
    expect(gen2.next().done).toEqual(true);
  });
});

describe('equivalentNodeOrDefault', () => {
  const originalNodeList = Object.keys(NODES);
  const appDefaultNode = configInitialState.nodeSelection;
  const mockNodeConfig = {
    network: 'ETH',
    service: 'fakeService',
    lib: new RPCNode('fakeEndpoint'),
    estimateGas: false
  };

  afterEach(() => {
    Object.keys(NODES).forEach(node => {
      if (originalNodeList.indexOf(node) === -1) {
        delete NODES[node];
      }
    });
  });

  it('should return node with equivalent network', () => {
    const node = equivalentNodeOrDefault({
      ...mockNodeConfig,
      network: 'Kovan'
    });
    expect(NODES[node].network).toEqual('Kovan');
  });

  it('should return app default if no eqivalent is found', () => {
    const node = equivalentNodeOrDefault({
      ...mockNodeConfig,
      network: 'noEqivalentExists'
    });
    expect(node).toEqual(appDefaultNode);
  });

  it('should ignore web3 from node list', () => {
    NODES.web3 = {
      ...mockNodeConfig,
      network: 'uniqueToWeb3'
    };

    const node = equivalentNodeOrDefault({
      ...mockNodeConfig,
      network: 'uniqueToWeb3'
    });
    expect(node).toEqual(appDefaultNode);
  });
});
