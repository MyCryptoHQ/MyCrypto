import { configuredStore } from 'store';
import { delay, SagaIterator } from 'redux-saga';
import { call, fork, put, take, select, apply } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import {
  changeNodeSucceeded,
  changeNodeRequested,
  changeNodeFailed,
  changeNodeForce,
  setLatestBlock,
  TypeKeys,
  ChangeNodeRequestedOneTimeAction,
  changeNodeRequestedOneTime
} from 'actions/config';
import {
  handleChangeNodeRequested,
  handleNewNetwork,
  handleChangeNodeRequestedOneTime
} from 'sagas/config/node';
import {
  getNodeId,
  getNodeConfig,
  getOffline,
  isStaticNodeId,
  getStaticNodeFromId,
  getCustomNodeFromId,
  getPreviouslySelectedNode
} from 'selectors/config';
import { Web3Wallet } from 'libs/wallet';
import { showNotification } from 'actions/notifications';
import { translateRaw } from 'translations';
import { StaticNodeConfig } from 'types/node';
import { staticNodesExpectedState } from './nodes/staticNodes.spec';
import { selectedNodeExpectedState } from './nodes/selectedNode.spec';
import { customNodesExpectedState, firstCustomNode } from './nodes/customNodes.spec';
import { unsetWeb3Node, unsetWeb3NodeOnWalletEvent } from 'sagas/config/web3';
import { shepherd } from 'mycrypto-shepherd';

// init module
configuredStore.getState();

describe('handleChangeNodeRequested*', () => {
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
  const changeNodeRequestedAction = changeNodeRequested(newNodeId);
  const latestBlock = '0xa';

  const data = {} as any;
  data.gen = cloneableGenerator(handleChangeNodeRequested)(changeNodeRequestedAction);

  function shouldBailOut(gen: SagaIterator, nextVal: any, errMsg: string) {
    expect(gen.next(nextVal).value).toEqual(put(showNotification('danger', errMsg, 5000)));
    expect(gen.next().value).toEqual(put(changeNodeFailed()));
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

  it('should show error if check times out', () => {
    data.clone1 = data.gen.clone();
    data.clone1.next(true);
    expect(data.clone1.throw('err').value).toEqual(
      put(showNotification('danger', translateRaw('ERROR_32'), 5000))
    );
    expect(data.clone1.next().value).toEqual(put(changeNodeFailed()));
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
    expect(data.gen.next(latestBlock).value).toEqual(put(setLatestBlock(latestBlock)));
  });

  it('should put changeNode', () => {
    expect(data.gen.next().value).toEqual(
      put(changeNodeSucceeded({ networkId: newNodeConfig.network, nodeId: newNodeId }))
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
  const customNodeAction = changeNodeRequested(firstCustomNode.id);
  data.customNode = handleChangeNodeRequested(customNodeAction);

  // test custom node
  it('should select getCustomNodeConfig and match race snapshot', () => {
    data.customNode.next();
    data.customNode.next(false);
    expect(data.customNode.next(defaultNodeConfig).value).toEqual(
      select(getCustomNodeFromId, firstCustomNode.id)
    );
    expect(data.customNode.next(customNodeConfigs.customNode1).value).toMatchSnapshot();
  });

  const customNodeIdNotFound = firstCustomNode.id + 'notFound';
  const customNodeNotFoundAction = changeNodeRequested(customNodeIdNotFound);
  data.customNodeNotFound = handleChangeNodeRequested(customNodeNotFoundAction);

  // test custom node not found
  it('should handle unknown / missing custom node', () => {
    data.customNodeNotFound.next();
    data.customNodeNotFound.next(false);
  });

  it('should select getCustomNodeFromId', () => {
    expect(data.customNodeNotFound.next(defaultNodeConfig).value).toEqual(
      select(getCustomNodeFromId, customNodeIdNotFound)
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
  const saga = handleChangeNodeRequestedOneTime();
  const action: ChangeNodeRequestedOneTimeAction = changeNodeRequestedOneTime('eth_auto');
  it('should take a one time action based on the url containing a valid network to switch to', () => {
    expect(saga.next().value).toEqual(take(TypeKeys.CONFIG_CHANGE_NODE_REQUESTED_ONETIME));
  });
  it(`should delay for 10 ms to allow shepherdProvider async init to complete`, () => {
    expect(saga.next(action).value).toEqual(call(delay, 100));
  });
  it('should dispatch the change node intent', () => {
    expect(saga.next().value).toEqual(put(changeNodeRequested(action.payload)));
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
