import { configuredStore } from 'store';
import { delay } from 'redux-saga';
import { call, cancel, fork, put, take, select } from 'redux-saga/effects';
import { cloneableGenerator, createMockTask } from 'redux-saga/utils';
import { toggleOfflineConfig, changeNode, changeNodeIntent, setLatestBlock } from 'actions/config';
import {
  pollOfflineStatus,
  handlePollOfflineStatus,
  handleNodeChangeIntent,
  unsetWeb3Node,
  unsetWeb3NodeOnWalletEvent,
  equivalentNodeOrDefault
} from 'sagas/config';
import { NODES, NodeConfig, NETWORKS } from 'config/data';
import {
  getNode,
  getNodeConfig,
  getOffline,
  getCustomNodeConfigs,
  getCustomNetworkConfigs
} from 'selectors/config';
import { INITIAL_STATE as configInitialState } from 'reducers/config';
import { getWalletInst } from 'selectors/wallet';
import { Web3Wallet } from 'libs/wallet';
import { RPCNode } from 'libs/nodes';
import { showNotification } from 'actions/notifications';
import { translateRaw } from 'translations';
import { resetWallet } from 'actions/wallet';
import { reset as resetTransaction } from 'actions/transaction';
// init module
configuredStore.getState();

describe('pollOfflineStatus*', () => {
  const nav = navigator as any;
  const doc = document as any;
  const data = {} as any;
  data.gen = cloneableGenerator(pollOfflineStatus)();
  const node = {
    lib: {
      ping: jest.fn()
    }
  };
  const isOffline = true;
  const raceSuccess = {
    pingSucceeded: true,
    timeout: false
  };
  const raceFailure = {
    pingSucceeded: false,
    timeout: true
  };

  let originalHidden;
  let originalOnLine;
  let originalRandom;

  beforeAll(() => {
    // backup global config
    originalHidden = document.hidden;
    originalOnLine = navigator.onLine;
    originalRandom = Math.random;

    // mock config
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
    Math.random = () => 0.001;
  });

  afterAll(() => {
    // restore global config
    Object.defineProperty(document, 'hidden', {
      value: originalHidden,
      writable: false
    });
    Object.defineProperty(navigator, 'onLine', {
      value: originalOnLine,
      writable: false
    });
    Math.random = originalRandom;
  });

  it('should select getNodeConfig', () => {
    expect(data.gen.next().value).toEqual(select(getNodeConfig));
  });

  it('should select getOffline', () => {
    expect(data.gen.next(node).value).toEqual(select(getOffline));
  });

  it('should call delay if document is hidden', () => {
    data.hiddenDoc = data.gen.clone();
    doc.hidden = true;
    expect(data.hiddenDoc.next(!isOffline).value).toEqual(call(delay, 1000));
    doc.hidden = false;
  });

  it('should race pingSucceeded and timeout', () => {
    data.isOfflineClone = data.gen.clone();
    data.shouldDelayClone = data.gen.clone();
    expect(data.gen.next(isOffline).value).toMatchSnapshot();
  });

  it('should toggle offline and show notification if navigator disagrees with isOffline and ping succeeds', () => {
    expect(data.gen.next(raceSuccess).value).toEqual(
      put(showNotification('success', 'Your connection to the network has been restored!', 3000))
    );
    expect(data.gen.next().value).toEqual(put(toggleOfflineConfig()));
  });

  it('should toggle offline and show notification if navigator agrees with isOffline and ping fails', () => {
    nav.onLine = isOffline;
    expect(data.isOfflineClone.next(!isOffline));
    expect(data.isOfflineClone.next(raceFailure).value).toMatchSnapshot();
    expect(data.isOfflineClone.next().value).toEqual(put(toggleOfflineConfig()));
    nav.onLine = !isOffline;
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
    expect(gen.next(mockTask).value).toEqual(take('CONFIG_STOP_POLL_OFFLINE_STATE'));
  });

  it('should cancel pollOfflineStatus', () => {
    expect(gen.next().value).toEqual(cancel(mockTask));
  });
});

describe('handleNodeChangeIntent*', () => {
  let originalRandom;

  // normal operation variables
  const defaultNode = configInitialState.nodeSelection;
  const defaultNodeConfig = NODES[defaultNode];
  const customNetworkConfigs = [];
  const defaultNodeNetwork = NETWORKS[defaultNodeConfig.network];
  const newNode = Object.keys(NODES).reduce(
    (acc, cur) => (NODES[acc].network === defaultNodeConfig.network ? cur : acc)
  );
  const newNodeConfig = NODES[newNode];
  const newNodeNetwork = NETWORKS[newNodeConfig.network];
  const changeNodeIntentAction = changeNodeIntent(newNode);
  const truthyWallet = true;
  const latestBlock = '0xa';
  const raceSuccess = {
    lb: latestBlock
  };
  const raceFailure = {
    to: true
  };

  const data = {} as any;
  data.gen = cloneableGenerator(handleNodeChangeIntent)(changeNodeIntentAction);

  function shouldBailOut(gen, nextVal, errMsg) {
    expect(gen.next(nextVal).value).toEqual(put(showNotification('danger', errMsg, 5000)));
    expect(gen.next().value).toEqual(
      put(changeNode(defaultNode, defaultNodeConfig, defaultNodeNetwork))
    );
    expect(gen.next().done).toEqual(true);
  }

  beforeAll(() => {
    originalRandom = Math.random;
    Math.random = () => 0.001;
  });

  afterAll(() => {
    Math.random = originalRandom;
  });

  it('should select getNode', () => {
    expect(data.gen.next().value).toEqual(select(getNode));
  });

  it('should select nodeConfig', () => {
    expect(data.gen.next(defaultNode).value).toEqual(select(getNodeConfig));
  });

  it('should select getCustomNetworkConfigs', () => {
    expect(data.gen.next(defaultNodeConfig).value).toEqual(select(getCustomNetworkConfigs));
  });

  it('should race getCurrentBlock and delay', () => {
    expect(data.gen.next(customNetworkConfigs).value).toMatchSnapshot();
  });

  it('should show error and revert to previous node if check times out', () => {
    data.clone1 = data.gen.clone();
    shouldBailOut(data.clone1, raceFailure, translateRaw('ERROR_32'));
  });

  it('should put setLatestBlock', () => {
    expect(data.gen.next(raceSuccess).value).toEqual(put(setLatestBlock(latestBlock)));
  });

  it('should put changeNode', () => {
    expect(data.gen.next().value).toEqual(
      put(changeNode(changeNodeIntentAction.payload, newNodeConfig, newNodeNetwork))
    );
  });

  it('should select getWalletInst', () => {
    expect(data.gen.next().value).toEqual(select(getWalletInst));
  });

  it('should call reload if wallet exists and network is new', () => {
    data.clone2 = data.gen.clone();
    expect(data.clone2.next(truthyWallet).value).toEqual(put(resetWallet()));
    expect(data.clone2.next(truthyWallet).value).toEqual(put(resetTransaction()));
    expect(data.clone2.next().done).toEqual(true);
  });

  it('should be done', () => {
    expect(data.gen.next().done).toEqual(true);
  });

  // custom node variables
  const customNodeConfigs = [
    {
      name: 'name',
      url: 'url',
      port: 443,
      network: 'network'
    }
  ];
  const customNodeIdFound = 'url:443';
  const customNodeIdNotFound = 'notFound';
  const customNodeAction = changeNodeIntent(customNodeIdFound);
  const customNodeNotFoundAction = changeNodeIntent(customNodeIdNotFound);
  data.customNode = handleNodeChangeIntent(customNodeAction);
  data.customNodeNotFound = handleNodeChangeIntent(customNodeNotFoundAction);

  // test custom node
  it('should select getCustomNodeConfig and match race snapshot', () => {
    data.customNode.next();
    data.customNode.next(defaultNode);
    data.customNode.next(defaultNodeConfig);
    expect(data.customNode.next(customNetworkConfigs).value).toEqual(select(getCustomNodeConfigs));
    expect(data.customNode.next(customNodeConfigs).value).toMatchSnapshot();
  });

  // test custom node not found
  it('should handle unknown / missing custom node', () => {
    data.customNodeNotFound.next();
    data.customNodeNotFound.next(defaultNode);
    data.customNodeNotFound.next(defaultNodeConfig);
    expect(data.customNodeNotFound.next(customNetworkConfigs).value).toEqual(
      select(getCustomNodeConfigs)
    );
    shouldBailOut(
      data.customNodeNotFound,
      customNodeConfigs,
      `Attempted to switch to unknown node '${customNodeNotFoundAction.payload}'`
    );
  });
});

describe('unsetWeb3Node*', () => {
  const node = 'web3';
  const mockNodeConfig = { network: 'ETH' } as any;
  const newNode = equivalentNodeOrDefault(mockNodeConfig);
  const gen = unsetWeb3Node();

  it('should select getNode', () => {
    expect(gen.next().value).toEqual(select(getNode));
  });

  it('should select getNodeConfig', () => {
    expect(gen.next(node).value).toEqual(select(getNodeConfig));
  });

  it('should put changeNodeIntent', () => {
    expect(gen.next(mockNodeConfig).value).toEqual(put(changeNodeIntent(newNode)));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });

  it('should return early if node type is not web3', () => {
    const gen1 = unsetWeb3Node();
    gen1.next();
    gen1.next('notWeb3');
    expect(gen1.next().done).toEqual(true);
  });
});

describe('unsetWeb3NodeOnWalletEvent*', () => {
  const fakeAction = {};
  const mockNode = 'web3';
  const mockNodeConfig: Partial<NodeConfig> = { network: 'ETH' };
  const gen = unsetWeb3NodeOnWalletEvent(fakeAction);

  it('should select getNode', () => {
    expect(gen.next().value).toEqual(select(getNode));
  });

  it('should select getNodeConfig', () => {
    expect(gen.next(mockNode).value).toEqual(select(getNodeConfig));
  });

  it('should put changeNodeIntent', () => {
    expect(gen.next(mockNodeConfig).value).toEqual(
      put(changeNodeIntent(equivalentNodeOrDefault(mockNodeConfig as any)))
    );
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });

  it('should return early if node type is not web3', () => {
    const gen1 = unsetWeb3NodeOnWalletEvent({ payload: false });
    gen1.next(); //getNode
    gen1.next('notWeb3'); //getNodeConfig
    expect(gen1.next().done).toEqual(true);
  });

  it('should return early if wallet type is web3', () => {
    const mockAddress = '0x0';
    const mockNetwork = 'ETH';
    const mockWeb3Wallet = new Web3Wallet(mockAddress, mockNetwork);
    const gen2 = unsetWeb3NodeOnWalletEvent({ payload: mockWeb3Wallet });
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
