import { delay, SagaIterator } from 'redux-saga';
import { call, cancel, fork, put, take, select, apply } from 'redux-saga/effects';
import { cloneableGenerator, createMockTask } from 'redux-saga/utils';
import { shepherd } from 'mycrypto-shepherd';

import { translateRaw } from 'translations';
import { StaticNodeConfig, CustomNodeConfig } from 'types/node';
import { CustomNetworkConfig } from 'types/network';
import { getShepherdOffline, getShepherdPending } from 'libs/nodes';
import { Web3Service } from 'libs/nodes/web3';
import { Web3Wallet } from 'libs/wallet';
import { configuredStore } from 'features/store';
import { getOffline, isStaticNodeId } from 'features/selectors';
import { showNotification } from 'features/notifications/actions';
import { TypeKeys, ChangeNodeIntentOneTimeAction, SelectedNodeState } from './types';
import {
  changeNodeForce,
  changeNodeIntentOneTime,
  changeLanguage,
  setOnline,
  setOffline,
  toggleAutoGasLimit,
  setLatestBlock,
  addCustomNode,
  removeCustomNode,
  addCustomNetwork,
  removeCustomNetwork,
  changeNodeIntent,
  changeNode,
  web3UnsetNode,
  web3SetNode
} from './actions';
import {
  STATIC_NETWORKS_INITIAL_STATE,
  STATIC_NODES_INITIAL_STATE,
  meta,
  staticNetworks,
  customNetworks,
  customNodes,
  selectedNode,
  staticNodes
} from './reducers';
import {
  getNodeId,
  getNodeConfig,
  getStaticNodeFromId,
  getCustomNodeFromId,
  getPreviouslySelectedNode
} from './selectors';
import {
  handleNodeChangeIntent,
  handlePollOfflineStatus,
  pollOfflineStatusSaga,
  handleNewNetwork,
  handleNodeChangeIntentOneTime,
  unsetWeb3Node,
  unsetWeb3NodeOnWalletEvent
} from './sagas';

// init module
configuredStore.getState();

//#region Meta
describe('meta reducer', () => {
  const expectedInitialState = {
    languageSelection: 'en',
    offline: false,
    autoGasLimit: true,
    latestBlock: '???'
  };

  const expectedState = {
    initialState: expectedInitialState,
    changingLanguage: {
      ...expectedInitialState,
      languageSelection: 'langaugeToChange'
    },
    togglingToOffline: {
      ...expectedInitialState,
      offline: true
    },
    togglingToOnline: {
      ...expectedInitialState,
      offline: false
    },
    togglingToManualGasLimit: {
      ...expectedInitialState,
      autoGasLimit: false
    },
    togglingToAutoGasLimit: {
      ...expectedInitialState,
      autoGasLimit: true
    },
    settingLatestBlock: {
      ...expectedInitialState,
      latestBlock: '12345'
    }
  };

  const actions = {
    changeLangauge: changeLanguage('langaugeToChange'),
    setOnline: setOnline(),
    setOffline: setOffline(),
    toggleAutoGasLimit: toggleAutoGasLimit(),
    setLatestBlock: setLatestBlock('12345')
  };
  it('should return the inital state', () =>
    expect(meta(undefined, {} as any)).toEqual(expectedState.initialState));

  it('should handle toggling to offline', () =>
    expect(meta(expectedState.initialState, actions.setOffline)).toEqual(
      expectedState.togglingToOffline
    ));

  it('should handle toggling back to online', () =>
    expect(meta(expectedState.togglingToOffline, actions.setOnline)).toEqual(
      expectedState.togglingToOnline
    ));

  it('should handle toggling to manual gas limit', () =>
    expect(meta(expectedState.initialState, actions.toggleAutoGasLimit)).toEqual(
      expectedState.togglingToManualGasLimit
    ));

  it('should handle toggling back to auto gas limit', () =>
    expect(meta(expectedState.togglingToManualGasLimit, actions.toggleAutoGasLimit)).toEqual(
      expectedState.togglingToAutoGasLimit
    ));

  it('should handle setting the latest block', () =>
    expect(meta(expectedState.initialState, actions.setLatestBlock)).toEqual(
      expectedState.settingLatestBlock
    ));
});
//#endregion Meta

//#region Networks

//#region Custom Networks
describe('custom networks reducer', () => {
  const firstCustomNetworkId = 'firstCustomNetwork';
  const firstCustomNetworkConfig: CustomNetworkConfig = {
    isCustom: true,
    chainId: 1,
    name: firstCustomNetworkId,
    unit: 'customNetworkUnit',
    dPathFormats: null
  };

  const secondCustomNetworkId = 'secondCustomNetwork';
  const secondCustomNetworkConfig: CustomNetworkConfig = {
    ...firstCustomNetworkConfig,
    name: secondCustomNetworkId
  };

  const expectedState = {
    initialState: {},
    addFirstCustomNetwork: { [firstCustomNetworkId]: firstCustomNetworkConfig },
    addSecondCustomNetwork: {
      [firstCustomNetworkId]: firstCustomNetworkConfig,
      [secondCustomNetworkId]: secondCustomNetworkConfig
    },
    removeFirstCustomNetwork: { [secondCustomNetworkId]: secondCustomNetworkConfig }
  };

  const actions = {
    addFirstCustomNetwork: addCustomNetwork({
      id: firstCustomNetworkId,
      config: firstCustomNetworkConfig
    }),
    addSecondCustomNetwork: addCustomNetwork({
      config: secondCustomNetworkConfig,
      id: secondCustomNetworkId
    }),
    removeFirstCustomNetwork: removeCustomNetwork({ id: firstCustomNetworkId })
  };
  it('should return the intial state', () =>
    expect(customNetworks(undefined, {} as any)).toEqual(expectedState.initialState));

  it('should handle adding the first custom network', () =>
    expect(customNetworks(expectedState.initialState, actions.addFirstCustomNetwork)).toEqual(
      expectedState.addFirstCustomNetwork
    ));

  it('should handle adding the second custom network', () =>
    expect(
      customNetworks(expectedState.addFirstCustomNetwork, actions.addSecondCustomNetwork)
    ).toEqual(expectedState.addSecondCustomNetwork));

  it('should handle removing the first custom network', () =>
    expect(
      customNetworks(expectedState.addSecondCustomNetwork, actions.removeFirstCustomNetwork)
    ).toEqual(expectedState.removeFirstCustomNetwork));
});
//#endregion Custom Networks

//#region Static Networks
describe('Testing contained data', () => {
  it(`contain unique chainIds`, () => {
    const networkValues = Object.values(STATIC_NETWORKS_INITIAL_STATE);
    const chainIds = networkValues.map(a => a.chainId);
    const chainIdsSet = new Set(chainIds);
    expect(Array.from(chainIdsSet).length).toEqual(chainIds.length);
  });
});

describe('static networks reducer', () => {
  it('should return the initial state', () =>
    expect(JSON.stringify(staticNetworks(undefined, {} as any))).toEqual(
      JSON.stringify(STATIC_NETWORKS_INITIAL_STATE)
    ));
});
//#endregion Static Networks

//#endregion Networks

//#region Nodes

//#region Custom Nodes
const firstCustomNodeId = 'customNode1';
const firstCustomNode: CustomNodeConfig = {
  isCustom: true,
  id: firstCustomNodeId,
  lib: jest.fn() as any,
  name: 'My cool custom node',
  network: 'CustomNetworkId',
  service: 'your custom node',
  url: '127.0.0.1'
};
const secondCustomNodeId = 'customNode2';
const secondCustomNode: CustomNodeConfig = {
  ...firstCustomNode,
  id: secondCustomNodeId
};
const customNodesExpectedState = {
  initialState: {},
  addFirstCustomNode: { [firstCustomNodeId]: firstCustomNode },
  addSecondCustomNode: {
    [firstCustomNodeId]: firstCustomNode,
    [secondCustomNodeId]: secondCustomNode
  },
  removeFirstCustomNode: { [secondCustomNodeId]: secondCustomNode }
};

describe('custom nodes reducer', () => {
  const actions = {
    addFirstCustomNode: addCustomNode({ id: firstCustomNodeId, config: firstCustomNode }),
    addSecondCustomNode: addCustomNode({ id: secondCustomNodeId, config: secondCustomNode }),
    removeFirstCustomNode: removeCustomNode({ id: firstCustomNodeId })
  };

  it('should return the initial state', () =>
    expect(customNodes(undefined, {} as any)).toEqual({}));

  it('should handle adding the first custom node', () =>
    expect(customNodes(customNodesExpectedState.initialState, actions.addFirstCustomNode)).toEqual(
      customNodesExpectedState.addFirstCustomNode
    ));
  it('should handle adding a second custom node', () =>
    expect(
      customNodes(customNodesExpectedState.addFirstCustomNode, actions.addSecondCustomNode)
    ).toEqual(customNodesExpectedState.addSecondCustomNode));
  it('should handle removing the first custom node', () =>
    expect(
      customNodes(customNodesExpectedState.addSecondCustomNode, actions.removeFirstCustomNode)
    ).toEqual(customNodesExpectedState.removeFirstCustomNode));
});
//#endregion Custom Nodes

//#region Selected Node
const selectedNodeExpectedState = {
  initialState: { nodeId: 'eth_mycrypto', prevNode: 'eth_mycrypto', pending: false },
  nodeChange: { nodeId: 'nodeToChangeTo', prevNode: 'eth_auto', pending: false },
  nodeChangeIntent: { nodeId: 'eth_mycrypto', prevNode: 'eth_mycrypto', pending: true }
};
describe('selected node reducer', () => {
  const actions = {
    changeNode: changeNode({ nodeId: 'nodeToChangeTo', networkId: 'networkToChangeTo' }),
    changeNodeIntent: changeNodeIntent('eth_mycrypto')
  };

  it('should handle a node change', () =>
    expect(selectedNode(undefined, actions.changeNode)).toEqual(
      selectedNodeExpectedState.nodeChange
    ));

  it('should handle the intent to change a node', () =>
    expect(
      selectedNode(
        selectedNodeExpectedState.initialState as SelectedNodeState,
        actions.changeNodeIntent
      )
    ).toEqual(selectedNodeExpectedState.nodeChangeIntent));
});
//#endregion Selected Node

//#region Static Nodes
const web3Id = 'web3';
const web3Node: StaticNodeConfig = {
  isCustom: false,
  network: 'ETH',
  service: Web3Service,
  lib: jest.fn() as any,
  estimateGas: false,
  hidden: true
};
export const staticNodesExpectedState = {
  initialState: staticNodes(undefined, {} as any),
  setWeb3: { ...STATIC_NODES_INITIAL_STATE, [web3Id]: web3Node },
  unsetWeb3: { ...STATIC_NODES_INITIAL_STATE }
};
describe('static nodes reducer', () => {
  const actions = {
    web3SetNode: web3SetNode({ id: web3Id, config: web3Node }),
    web3UnsetNode: web3UnsetNode()
  };

  it('should handle setting the web3 node', () =>
    expect(staticNodes(STATIC_NODES_INITIAL_STATE, actions.web3SetNode)).toEqual(
      staticNodesExpectedState.setWeb3
    ));

  it('should handle unsetting the web3 node', () =>
    expect(staticNodes(staticNodesExpectedState.setWeb3, actions.web3UnsetNode)).toEqual(
      staticNodesExpectedState.unsetWeb3
    ));
});
//#endregion Static Nodes

//#endregion Nodes

describe('pollOfflineStatus*', () => {
  const restoreNotif = 'Your connection to the network has been restored!';
  const lostNetworkNotif = `You’ve lost your connection to the network, check your internet connection or try changing networks from the dropdown at the top right of the page.`;
  const offlineNotif = 'You are currently offline. Some features will be unavailable.';
  const offlineOnFirstTimeCase = pollOfflineStatusSaga();

  it('should delay by 2.5 seconds', () => {
    expect(offlineOnFirstTimeCase.next().value).toEqual(call(delay, 2500));
  });

  it('should skip if a node change is pending', () => {
    expect(offlineOnFirstTimeCase.next().value).toEqual(call(getShepherdPending));
    expect(offlineOnFirstTimeCase.next(true).value).toEqual(call(delay, 2500));
    expect(offlineOnFirstTimeCase.next().value).toEqual(call(getShepherdPending));
  });

  it('should select offline', () => {
    expect(offlineOnFirstTimeCase.next(false).value).toEqual(select(getOffline));
  });

  it('should select shepherd"s offline', () => {
    expect(offlineOnFirstTimeCase.next(false).value).toEqual(call(getShepherdOffline));
  });

  // .PUT.action.payload.msg is used because the action creator uses an random ID, cant to a showNotif comparision
  it('should put a different notif if online for the first time ', () => {
    expect(offlineOnFirstTimeCase.next(true).value).toEqual(put(setOffline()));
    expect((offlineOnFirstTimeCase.next().value as any).PUT.action.payload.msg).toEqual(
      offlineNotif
    );
  });

  it('should loop around then go back online, putting a restore msg', () => {
    expect(offlineOnFirstTimeCase.next().value).toEqual(call(delay, 2500));
    expect(offlineOnFirstTimeCase.next().value).toEqual(call(getShepherdPending));
    expect(offlineOnFirstTimeCase.next(false).value).toEqual(select(getOffline));
    expect(offlineOnFirstTimeCase.next(true).value).toEqual(call(getShepherdOffline));
    expect((offlineOnFirstTimeCase.next().value as any).PUT.action.payload.msg).toEqual(
      restoreNotif
    );
    expect(offlineOnFirstTimeCase.next(false).value).toEqual(put(setOnline()));
  });

  it('should put a generic lost connection notif on every time afterwards', () => {
    expect(offlineOnFirstTimeCase.next().value).toEqual(call(delay, 2500));
    expect(offlineOnFirstTimeCase.next().value).toEqual(call(getShepherdPending));
    expect(offlineOnFirstTimeCase.next(false).value).toEqual(select(getOffline));
    expect(offlineOnFirstTimeCase.next(false).value).toEqual(call(getShepherdOffline));
    expect(offlineOnFirstTimeCase.next(true).value).toEqual(put(setOffline()));
    expect((offlineOnFirstTimeCase.next().value as any).PUT.action.payload.msg).toEqual(
      lostNetworkNotif
    );
  });
});

describe('handlePollOfflineStatus*', () => {
  const gen = handlePollOfflineStatus();
  const mockTask = createMockTask();

  it('should fork pollOffineStatus', () => {
    const expectedForkYield = fork(pollOfflineStatusSaga);
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
  let originalRandom: any;

  // normal operation variables
  const defaultNodeId: any = selectedNodeExpectedState.initialState.nodeId;
  const defaultNodeConfig: any = (staticNodesExpectedState as any).initialState[defaultNodeId];
  const newNodeId = Object.keys(staticNodesExpectedState.initialState).reduce(
    (acc, cur) =>
      (staticNodesExpectedState as any).initialState[cur].network !== defaultNodeConfig.network
        ? cur
        : acc
  );
  const newNodeConfig: StaticNodeConfig = (staticNodesExpectedState as any).initialState[newNodeId];
  const isOffline = false;
  const changeNodeIntentAction = changeNodeIntent(newNodeId);
  const latestBlock = '0xa';

  const data = {} as any;
  data.gen = cloneableGenerator(handleNodeChangeIntent)(changeNodeIntentAction);

  function shouldBailOut(gen: SagaIterator, nextVal: any, errMsg: string) {
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

  it('should get the next network', () => {
    expect(data.gen.next(newNodeConfig).value).toMatchSnapshot();
  });

  it('should select isOffline', () => {
    expect(data.gen.next(true).value).toEqual(select(getOffline));
  });

  it('should show error and revert to previous node if online check times out', () => {
    data.nodeError = data.gen.clone();
    data.nodeError.next(isOffline);
    expect(data.nodeError.throw('err').value).toEqual(select(getNodeId));
    expect(data.nodeError.next(defaultNodeId).value).toEqual(
      put(showNotification('danger', translateRaw('ERROR_32'), 5000))
    );
    expect(data.nodeError.next().value).toEqual(
      put(changeNode({ networkId: defaultNodeConfig.network, nodeId: defaultNodeId }))
    );
    expect(data.nodeError.next().done).toEqual(true);
  });

  it('should sucessfully switch to the manual node', () => {
    expect(data.gen.next(isOffline).value).toEqual(
      apply(shepherd, shepherd.manual, [newNodeId, false])
    );
  });

  it('should get the current block', () => {
    data.gen.next();
  });

  it('should put setLatestBlock', () => {
    expect(data.gen.next(latestBlock).value).toEqual(put(setLatestBlock(latestBlock)));
  });

  it('should put changeNode', () => {
    expect(data.gen.next().value).toEqual(
      put(changeNode({ networkId: newNodeConfig.network, nodeId: newNodeId }))
    );
  });

  it('should fork handleNewNetwork', () => {
    expect(data.gen.next().value).toEqual(fork(handleNewNetwork));
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
    expect(data.customNode.next(customNodeConfigs.customNode1).value).toMatchSnapshot();
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

describe('handleNodeChangeIntentOneTime', () => {
  const saga = handleNodeChangeIntentOneTime();
  const action: ChangeNodeIntentOneTimeAction = changeNodeIntentOneTime('eth_auto');
  it('should take a one time action based on the url containing a valid network to switch to', () => {
    expect(saga.next().value).toEqual(take(TypeKeys.CONFIG_NODE_CHANGE_INTENT_ONETIME));
  });
  it(`should delay for 10 ms to allow shepherdProvider async init to complete`, () => {
    expect(saga.next(action).value).toEqual(call(delay, 100));
  });
  it('should dispatch the change node intent', () => {
    expect(saga.next().value).toEqual(put(changeNodeIntent(action.payload)));
  });
  it('should be done', () => {
    expect(saga.next().done).toEqual(true);
  });
});

describe('unsetWeb3Node*', () => {
  const previousNodeId = 'eth_mycrypto';
  const mockNodeId = 'web3';
  const gen = unsetWeb3Node();

  it('should select getNode', () => {
    expect(gen.next().value).toEqual(select(getNodeId));
  });

  it('should select an alternative node to web3', () => {
    // get a 'no visual difference' error here
    expect(gen.next(mockNodeId).value).toEqual(select(getPreviouslySelectedNode));
  });

  it('should put changeNodeForce', () => {
    expect(gen.next(previousNodeId).value).toEqual(put(changeNodeForce(previousNodeId)));
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
  const fakeAction: any = {};
  const mockNodeId = 'web3';
  const previousNodeId = 'eth_mycrypto';
  const gen = unsetWeb3NodeOnWalletEvent(fakeAction);

  it('should select getNode', () => {
    expect(gen.next().value).toEqual(select(getNodeId));
  });

  it('should select an alternative node to web3', () => {
    expect(gen.next(mockNodeId).value).toEqual(select(getPreviouslySelectedNode));
  });

  it('should put changeNodeForce', () => {
    expect(gen.next(previousNodeId).value).toEqual(put(changeNodeForce(previousNodeId)));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });

  it('should return early if node type is not web3', () => {
    const gen1 = unsetWeb3NodeOnWalletEvent({ payload: false } as any);
    gen1.next(); //getNode
    gen1.next('notWeb3'); //getNodeConfig
    expect(gen1.next().done).toEqual(true);
  });

  it('should return early if wallet type is web3', () => {
    const mockAddress = '0x0';
    const mockNetwork = 'ETH';
    const mockWeb3Wallet = new Web3Wallet(mockAddress, mockNetwork);
    const gen2 = unsetWeb3NodeOnWalletEvent({ payload: mockWeb3Wallet } as any);
    gen2.next(); //getNode
    gen2.next('web3'); //getNodeConfig
    expect(gen2.next().done).toEqual(true);
  });
});
