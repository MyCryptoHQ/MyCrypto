import { configuredStore } from 'store';
import { delay } from 'redux-saga';
import { call, cancel, fork, put, take, select } from 'redux-saga/effects';
import { cloneableGenerator, createMockTask } from 'redux-saga/utils';
import { toggleOffline, changeNode, changeNodeIntent, setLatestBlock } from 'actions/config';
import {
  handleNodeChangeIntent,
  handlePollOfflineStatus,
  pollOfflineStatus,
  reload
} from 'sagas/config/node';
import {
  getNodeId,
  getNodeConfig,
  getOffline,
  isStaticNodeId,
  getStaticNodeFromId,
  getNetworkConfigById,
  getCustomNodeFromId,
  getStaticAltNodeIdToWeb3
} from 'selectors/config';
import { Web3Wallet } from 'libs/wallet';
import { showNotification } from 'actions/notifications';
import { translateRaw } from 'translations';
import { StaticNodeConfig } from 'types/node';
import { staticNodesExpectedState } from './nodes/staticNodes.spec';
import { metaExpectedState } from './meta/meta.spec';
import { selectedNodeExpectedState } from './nodes/selectedNode.spec';
import { customNodesExpectedState, firstCustomNodeId } from './nodes/customNodes.spec';
import { unsetWeb3Node, unsetWeb3NodeOnWalletEvent } from 'sagas/config/web3';

// init module
configuredStore.getState();

describe('pollOfflineStatus*', () => {
  const { togglingToOffline, togglingToOnline } = metaExpectedState;
  const nav = navigator as any;
  const doc = document as any;
  const data = {} as any;
  data.gen = cloneableGenerator(pollOfflineStatus)();
  const node = {
    lib: {
      ping: jest.fn()
    }
  };
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
    expect(data.hiddenDoc.next(togglingToOnline.offline).value).toEqual(call(delay, 1000));
    doc.hidden = false;
  });

  it('should race pingSucceeded and timeout', () => {
    data.isOfflineClone = data.gen.clone();
    data.shouldDelayClone = data.gen.clone();
    expect(data.gen.next(togglingToOffline.offline).value).toMatchSnapshot();
  });

  it('should toggle offline and show notification if navigator disagrees with isOffline and ping succeeds', () => {
    expect(data.gen.next(raceSuccess).value).toEqual(
      put(showNotification('success', 'Your connection to the network has been restored!', 3000))
    );
    expect(data.gen.next().value).toEqual(put(toggleOffline()));
  });

  it('should toggle offline and show notification if navigator agrees with isOffline and ping fails', () => {
    nav.onLine = togglingToOffline.offline;
    expect(data.isOfflineClone.next(togglingToOnline.offline));
    expect(data.isOfflineClone.next(raceFailure).value).toMatchSnapshot();
    expect(data.isOfflineClone.next().value).toEqual(put(toggleOffline()));
    nav.onLine = togglingToOnline.offline;
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
  const defaultNodeId = selectedNodeExpectedState.initialState.nodeId;
  const defaultNodeConfig: StaticNodeConfig = staticNodesExpectedState.initialState[defaultNodeId];
  const newNodeId = Object.keys(staticNodesExpectedState.initialState).reduce(
    (acc, cur) =>
      staticNodesExpectedState.initialState[cur].network !== defaultNodeConfig.network ? cur : acc
  );
  const newNodeConfig: StaticNodeConfig = staticNodesExpectedState.initialState[newNodeId];

  const changeNodeIntentAction = changeNodeIntent(newNodeId);
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
    expect(gen.next(nextVal).value).toEqual(select(getNodeId));
    expect(gen.next(defaultNodeId).value).toEqual(put(showNotification('danger', errMsg, 5000)));
    expect(gen.next().value).toEqual(
      put(changeNode({ networkId: defaultNodeConfig.network, nodeId: defaultNodeId }))
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

  it('should select is static node', () => {
    expect(data.gen.next().value).toEqual(select(isStaticNodeId, newNodeId));
  });

  it('should select nodeConfig', () => {
    expect(data.gen.next(defaultNodeId).value).toEqual(select(getNodeConfig));
  });

  it('should select getStaticNodeFromId', () => {
    expect(data.gen.next(defaultNodeConfig).value).toEqual(select(getStaticNodeFromId, newNodeId));
  });

  it('should race getCurrentBlock and delay', () => {
    expect(data.gen.next(newNodeConfig).value).toMatchSnapshot();
  });

  it('should show error and revert to previous node if check times out', () => {
    data.clone1 = data.gen.clone();
    shouldBailOut(data.clone1, raceFailure, translateRaw('ERROR_32'));
  });
  it('should getNetworkConfigById', () => {
    expect(data.gen.next(raceSuccess).value).toEqual(
      select(getNetworkConfigById, newNodeConfig.network)
    );
  });
  it('should put setLatestBlock', () => {
    expect(data.gen.next(raceSuccess).value).toEqual(put(setLatestBlock(latestBlock)));
  });

  it('should put changeNode', () => {
    expect(data.gen.next().value).toEqual(
      put(changeNode({ networkId: newNodeConfig.network, nodeId: newNodeId }))
    );
  });

  it('should call reload if network is new', () => {
    expect(data.gen.next().value).toEqual(call(reload));
    expect(data.gen.next().done).toEqual(true);
  });

  it('should be done', () => {
    expect(data.gen.next().done).toEqual(true);
  });

  // custom node variables
  const customNodeConfigs = customNodesExpectedState.addFirstCustomNode;
  const customNodeAction = changeNodeIntent(firstCustomNodeId);
  data.customNode = handleNodeChangeIntent(customNodeAction);

  // test custom node
  it('should select getCustomNodeConfig and match race snapshot', () => {
    data.customNode.next();
    data.customNode.next(false);
    expect(data.customNode.next(defaultNodeConfig).value).toEqual(
      select(getCustomNodeFromId, firstCustomNodeId)
    );
    expect(data.customNode.next(customNodeConfigs).value).toMatchSnapshot();
  });

  const customNodeIdNotFound = firstCustomNodeId + 'notFound';
  const customNodeNotFoundAction = changeNodeIntent(customNodeIdNotFound);
  data.customNodeNotFound = handleNodeChangeIntent(customNodeNotFoundAction);

  // test custom node not found
  it('should handle unknown / missing custom node', () => {
    data.customNodeNotFound.next();
    data.customNodeNotFound.next(false);
  });

  it('should blah', () => {
    expect(data.customNodeNotFound.next(defaultNodeConfig).value).toEqual(
      select(getCustomNodeFromId, customNodeIdNotFound)
    );
  });

  it('should blahah', () => {
    shouldBailOut(
      data.customNodeNotFound,
      null,
      `Attempted to switch to unknown node '${customNodeNotFoundAction.payload}'`
    );
  });
});

describe('unsetWeb3Node*', () => {
  const node = 'web3';
  const alternativeNodeId = 'eth_mycrypto';
  const gen = unsetWeb3Node();

  it('should select getNode', () => {
    expect(gen.next().value).toEqual(select(getNodeId));
  });

  it('should select an alternative node to web3', () => {
    expect(gen.next(node).value).toEqual(select(getStaticAltNodeIdToWeb3));
  });

  it('should put changeNodeIntent', () => {
    expect(gen.next(alternativeNodeId).value).toEqual(put(changeNodeIntent(alternativeNodeId)));
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
  const mockNodeId = 'web3';
  const alternativeNodeId = 'eth_mycrypto';
  const gen = unsetWeb3NodeOnWalletEvent(fakeAction);

  it('should select getNode', () => {
    expect(gen.next().value).toEqual(select(getNodeId));
  });

  it('should select an alternative node to web3', () => {
    expect(gen.next(mockNodeId).value).toEqual(select(getStaticAltNodeIdToWeb3));
  });

  it('should put changeNodeIntent', () => {
    expect(gen.next(alternativeNodeId).value).toEqual(put(changeNodeIntent(alternativeNodeId)));
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
