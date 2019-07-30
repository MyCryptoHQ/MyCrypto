import { delay, SagaIterator } from 'redux-saga';
import { call, fork, put, take, select, apply } from 'redux-saga/effects';
import { cloneableGenerator, SagaIteratorClone } from 'redux-saga/utils';
import { shepherd } from 'mycrypto-shepherd';

import { translateRaw } from 'translations';
import { makeAutoNodeName } from 'libs/nodes';
import { Web3Wallet } from 'libs/wallet';
import { StaticNodeConfig, CustomNodeConfig } from 'types/node';
import configuredStore from 'features/store';
import { selectedNodeExpectedState } from './nodes/selected/reducer.spec';
import { staticNodesExpectedState } from './nodes/static/reducer.spec';
import { customNodesExpectedState, firstCustomNode } from './nodes/custom/reducer.spec';
import { notificationsActions } from 'features/notifications';
import * as configMetaActions from './meta/actions';
import * as configMetaSelectors from './meta/selectors';
import * as configNetworksTypes from './networks/types';
import * as configNodesSelectors from './nodes/selectors';
import * as configNodesCustomTypes from './nodes/custom/types';
import * as configNodesCustomSelectors from './nodes/custom/selectors';
import * as configNodesSelectedTypes from './nodes/selected/types';
import * as configNodesSelectedActions from './nodes/selected/actions';
import * as configNodesSelectedReducer from './nodes/selected/reducer';
import * as configNodesSelectedSelectors from './nodes/selected/selectors';
import * as configNodesStaticSelectors from './nodes/static/selectors';
import * as selectors from './selectors';
import * as sagas from './sagas';

// init module
configuredStore.getState();

describe('handleChangeNodeRequested*', () => {
  let originalRandom: any;

  // normal operation variables
  const defaultNodeId: any = selectedNodeExpectedState.initialState.nodeId;
  const defaultNodeConfig: any = (staticNodesExpectedState as any).initialState[defaultNodeId];
  const newNodeId = Object.keys(staticNodesExpectedState.initialState).reduce((acc, cur) =>
    (staticNodesExpectedState as any).initialState[cur].network !== defaultNodeConfig.network
      ? cur
      : acc
  );
  const newNodeConfig: StaticNodeConfig = (staticNodesExpectedState as any).initialState[newNodeId];
  const isOffline = false;
  const changeNodeRequestedAction = configNodesSelectedActions.changeNodeRequested(newNodeId);
  const latestBlock = '0xa';

  const data = {} as any;
  data.gen = cloneableGenerator(sagas.handleChangeNodeRequested)(changeNodeRequestedAction);

  function shouldBailOut(gen: SagaIterator, nextVal: any, errMsg: string) {
    expect(gen.next(nextVal).value).toEqual(
      put(notificationsActions.showNotification('danger', errMsg, 5000))
    );
    expect(gen.next().value).toEqual(put(configNodesSelectedActions.changeNodeFailed()));
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
    expect(data.gen.next().value).toEqual(
      select(configNodesStaticSelectors.isStaticNodeId, newNodeId)
    );
  });

  it('should select nodeConfig', () => {
    expect(data.gen.next(defaultNodeId).value).toEqual(select(configNodesSelectors.getNodeConfig));
  });

  it('should select getStaticNodeFromId', () => {
    expect(data.gen.next(defaultNodeConfig).value).toEqual(
      select(selectors.getStaticNodeFromId, newNodeId)
    );
  });

  it('should get the next network', () => {
    expect(data.gen.next(newNodeConfig).value).toMatchSnapshot();
  });

  it('should select isOffline', () => {
    expect(data.gen.next(true).value).toEqual(select(configMetaSelectors.getOffline));
  });

  it('should show error if check times out', () => {
    data.clone1 = data.gen.clone();
    data.clone1.next(true);
    expect(data.clone1.throw('err').value).toEqual(
      put(notificationsActions.showNotification('danger', translateRaw('ERROR_32'), 5000))
    );
    expect(data.clone1.next().value).toEqual(put(configNodesSelectedActions.changeNodeFailed()));
    expect(data.clone1.next().done).toEqual(true);
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
    expect(data.gen.next(latestBlock).value).toEqual(
      put(configMetaActions.setLatestBlock(latestBlock))
    );
  });

  it('should put changeNode', () => {
    expect(data.gen.next().value).toEqual(
      put(
        configNodesSelectedActions.changeNodeSucceeded({
          networkId: newNodeConfig.network,
          nodeId: newNodeId
        })
      )
    );
  });

  it('should fork handleNewNetwork', () => {
    expect(data.gen.next().value).toEqual(fork(sagas.handleNewNetwork));
  });

  it('should be done', () => {
    expect(data.gen.next().done).toEqual(true);
  });

  // custom node variables
  const customNodeConfigs = customNodesExpectedState.addFirstCustomNode;
  const customNodeAction = configNodesSelectedActions.changeNodeRequested(firstCustomNode.id);
  data.customNode = sagas.handleChangeNodeRequested(customNodeAction);

  // test custom node
  it('should select getCustomNodeConfig and match race snapshot', () => {
    data.customNode.next();
    data.customNode.next(false);
    expect(data.customNode.next(defaultNodeConfig).value).toEqual(
      select(configNodesCustomSelectors.getCustomNodeFromId, firstCustomNode.id)
    );
    expect(data.customNode.next(customNodeConfigs.customNode1).value).toMatchSnapshot();
  });

  const customNodeIdNotFound = firstCustomNode.id + 'notFound';
  const customNodeNotFoundAction = configNodesSelectedActions.changeNodeRequested(
    customNodeIdNotFound
  );
  data.customNodeNotFound = sagas.handleChangeNodeRequested(customNodeNotFoundAction);

  // test custom node not found
  it('should handle unknown / missing custom node', () => {
    data.customNodeNotFound.next();
    data.customNodeNotFound.next(false);
  });

  it('should select getCustomNodeFromId', () => {
    expect(data.customNodeNotFound.next(defaultNodeConfig).value).toEqual(
      select(configNodesCustomSelectors.getCustomNodeFromId, customNodeIdNotFound)
    );
  });

  it('should show an error if was an unknown custom node', () => {
    shouldBailOut(
      data.customNodeNotFound,
      null,
      `Attempted to switch to unknown node '${customNodeNotFoundAction.payload}'`
    );
  });
});

describe('handleChangeNodeRequestedOneTime', () => {
  const saga = sagas.handleChangeNodeRequestedOneTime();
  const action: configNodesSelectedTypes.ChangeNodeRequestedOneTimeAction = configNodesSelectedActions.changeNodeRequestedOneTime(
    'eth_auto'
  );
  it('should take a one time action based on the url containing a valid network to switch to', () => {
    expect(saga.next().value).toEqual(
      take(configNodesSelectedTypes.ConfigNodesSelectedActions.CHANGE_REQUESTED_ONETIME)
    );
  });
  it(`should delay for 10 ms to allow shepherdProvider async init to complete`, () => {
    expect(saga.next(action).value).toEqual(call(delay, 100));
  });
  it('should dispatch the change node intent', () => {
    expect(saga.next().value).toEqual(
      put(configNodesSelectedActions.changeNodeRequested(action.payload))
    );
  });
  it('should be done', () => {
    expect(saga.next().done).toEqual(true);
  });
});

describe('unsetWeb3Node*', () => {
  const previousNodeId = 'eth_mycrypto';
  const mockNodeId = 'web3';
  const gen = sagas.unsetWeb3Node();

  it('should select getNode', () => {
    expect(gen.next().value).toEqual(select(configNodesSelectedSelectors.getNodeId));
  });

  it('should select an alternative node to web3', () => {
    // get a 'no visual difference' error here
    expect(gen.next(mockNodeId).value).toEqual(
      select(configNodesSelectedSelectors.getPreviouslySelectedNode)
    );
  });

  it('should put changeNodeForce', () => {
    expect(gen.next(previousNodeId).value).toEqual(
      put(configNodesSelectedActions.changeNodeForce(previousNodeId))
    );
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });

  it('should return early if node type is not web3', () => {
    const gen1 = sagas.unsetWeb3Node();
    gen1.next();
    gen1.next('notWeb3');
    expect(gen1.next().done).toEqual(true);
  });
});

describe('unsetWeb3NodeOnWalletEvent*', () => {
  const fakeAction: any = {};
  const mockNodeId = 'web3';
  const previousNodeId = 'eth_mycrypto';
  const gen = sagas.unsetWeb3NodeOnWalletEvent(fakeAction);

  it('should select getNode', () => {
    expect(gen.next().value).toEqual(select(configNodesSelectedSelectors.getNodeId));
  });

  it('should select an alternative node to web3', () => {
    expect(gen.next(mockNodeId).value).toEqual(
      select(configNodesSelectedSelectors.getPreviouslySelectedNode)
    );
  });

  it('should put changeNodeForce', () => {
    expect(gen.next(previousNodeId).value).toEqual(
      put(configNodesSelectedActions.changeNodeForce(previousNodeId))
    );
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });

  it('should return early if node type is not web3', () => {
    const gen1 = sagas.unsetWeb3NodeOnWalletEvent({ payload: false } as any);
    gen1.next(); //getNode
    gen1.next('notWeb3'); //getNodeConfig
    expect(gen1.next().done).toEqual(true);
  });

  it('should return early if wallet type is web3', () => {
    const mockAddress = '0x0';
    const mockNetwork = 'ETH';
    const mockWeb3Wallet = new Web3Wallet(mockAddress, mockNetwork);
    const gen2 = sagas.unsetWeb3NodeOnWalletEvent({ payload: mockWeb3Wallet } as any);
    gen2.next(); //getNode
    gen2.next('web3'); //getNodeConfig
    expect(gen2.next().done).toEqual(true);
  });
});

describe('handleNodeChangeForce*', () => {
  const payload: any = 'nodeId';
  const action: any = { payload };
  const gen = cloneableGenerator(sagas.handleNodeChangeForce)(action);
  const nodeConfig: any = { network: 'network' };

  it('should select isStaticNodeId', () => {
    expect(gen.next().value).toEqual(select(configNodesStaticSelectors.isStaticNodeId, payload));
  });

  it('should return if not static node', () => {
    const clone = gen.clone();
    expect(clone.next(false).done).toEqual(true);
  });

  it('should select getStaticNodeFromId', () => {
    expect(gen.next(true).value).toEqual(select(selectors.getStaticNodeFromId, payload));
  });

  it('should force the node change', () => {
    expect(gen.next(nodeConfig).value).toEqual(
      put(
        configNodesSelectedActions.changeNodeSucceeded({
          networkId: nodeConfig.network,
          nodeId: payload
        })
      )
    );
  });

  it('should put a change node intent', () => {
    expect(gen.next().value).toEqual(put(configNodesSelectedActions.changeNodeRequested(payload)));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('handleChangeNetworkRequested*', () => {
  const action: configNetworksTypes.ChangeNetworkRequestedAction = {
    payload: 'ETH',
    type: configNetworksTypes.ConfigNetworksActions.CHANGE_NETWORK_REQUESTED
  };
  const nextNodeName = makeAutoNodeName(action.payload);
  const customNode: CustomNodeConfig = {
    id: 'id',
    url: 'url',
    name: 'Custom Node',
    service: 'your custom node',
    network: action.payload,
    isCustom: true
  };
  const gen = cloneableGenerator(sagas.handleChangeNetworkRequested);
  const staticCase = gen(action);
  let customCase: SagaIteratorClone;
  let failureCase: SagaIteratorClone;

  it('should select isStaticNodeId', () => {
    expect(staticCase.next().value).toEqual(
      select(configNodesStaticSelectors.isStaticNodeId, nextNodeName)
    );
  });

  it('should put changeNodeRequested for auto node if static network', () => {
    customCase = staticCase.clone();
    expect(staticCase.next(true).value).toEqual(
      put(configNodesSelectedActions.changeNodeRequested(nextNodeName))
    );
    expect(staticCase.next().done).toBeTruthy();
  });

  it('should select getAllNodes if non-static network', () => {
    expect(customCase.next(false).value).toEqual(select(selectors.getAllNodes));
  });

  it('should put changeNodeRequested on the first custom node if found', () => {
    failureCase = customCase.clone();
    expect(customCase.next([customNode]).value).toEqual(
      put(configNodesSelectedActions.changeNodeRequested(customNode.id))
    );
  });

  it('should put showNotification if not a valid network', () => {
    const value = failureCase.next([]).value as any;
    expect(value.PUT.action.type).toBe('SHOW_NOTIFICATION');
  });
});

describe('handleRemoveCustomNode*', () => {
  const customNodeUrl = 'https://mycustomnode.com';
  const action: configNodesCustomTypes.RemoveCustomNodeAction = {
    type: configNodesCustomTypes.ConfigNodesCustomActions.REMOVE,
    payload: customNodeUrl
  };
  const sameCase = cloneableGenerator(sagas.handleRemoveCustomNode)(action);
  let diffCase: SagaIteratorClone;

  it('Should select getNodeId', () => {
    expect(sameCase.next().value).toEqual(select(configNodesSelectedSelectors.getNodeId));
  });

  it('Should put changeNodeForce to default network if current node id === removed node id', () => {
    diffCase = sameCase.clone();
    expect(sameCase.next(customNodeUrl).value).toEqual(
      put(
        configNodesSelectedActions.changeNodeForce(
          configNodesSelectedReducer.SELECTED_NODE_INITIAL_STATE.nodeId
        )
      )
    );
  });

  it('Should do nothing if current node id !== removed node id', () => {
    expect(diffCase.next('Different').done).toBeTruthy();
  });
});
