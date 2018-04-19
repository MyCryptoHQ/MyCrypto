import { configuredStore } from 'store';
import { cloneableGenerator, SagaIteratorClone } from 'redux-saga/utils';
import {
  handleNodeChangeForce,
  handleNetworkChangeIntent,
  handleRemoveCustomNode
} from 'sagas/config/node';
import { put, select } from 'redux-saga/effects';
import { isStaticNodeId, getStaticNodeFromId, getNodeId } from 'selectors/config';
import {
  TypeKeys,
  changeNode,
  changeNodeIntent,
  changeNodeForce,
  ChangeNetworkIntentAction,
  RemoveCustomNodeAction
} from 'actions/config';
import { makeAutoNodeName } from 'libs/nodes';
import { INITIAL_STATE as selectedNodeInitialState } from 'reducers/config/nodes/selectedNode';

// init module
configuredStore.getState();

describe('handleNodeChangeForce*', () => {
  const payload: any = 'nodeId';
  const action: any = { payload };
  const gen = cloneableGenerator(handleNodeChangeForce)(action);
  const nodeConfig: any = { network: 'network' };

  it('should select isStaticNodeId', () => {
    expect(gen.next().value).toEqual(select(isStaticNodeId, payload));
  });

  it('should return if not static node', () => {
    const clone = gen.clone();
    expect(clone.next(false).done).toEqual(true);
  });

  it('should select getStaticNodeFromId', () => {
    expect(gen.next(true).value).toEqual(select(getStaticNodeFromId, payload));
  });

  it('should force the node change', () => {
    expect(gen.next(nodeConfig).value).toEqual(
      put(
        changeNode({
          networkId: nodeConfig.network,
          nodeId: payload
        })
      )
    );
  });

  it('should put a change node intent', () => {
    expect(gen.next().value).toEqual(put(changeNodeIntent(payload)));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('handleNetworkChangeIntent*', () => {
  const action: ChangeNetworkIntentAction = {
    payload: 'ETH',
    type: TypeKeys.CONFIG_NETWORK_CHANGE_INTENT
  };
  const nextNodeName = makeAutoNodeName(action.payload);
  const gen = cloneableGenerator(handleNetworkChangeIntent);
  const successCase = gen(action);
  let failureCase: SagaIteratorClone;

  it('should select isStaticNodeId', () => {
    expect(successCase.next().value).toEqual(select(isStaticNodeId, nextNodeName));
  });

  it('should put changeNodeIntent if valid network', () => {
    failureCase = successCase.clone();
    expect(successCase.next(true).value).toEqual(put(changeNodeIntent(nextNodeName)));
    expect(successCase.next().done).toBeTruthy();
  });

  it('should do nothing if not a valid network', () => {
    expect(failureCase.next(false).done).toBeTruthy();
  });
});

describe('handleRemoveCustomNode*', () => {
  const customNodeUrl = 'https://mycustomnode.com';
  const action: RemoveCustomNodeAction = {
    type: TypeKeys.CONFIG_REMOVE_CUSTOM_NODE,
    payload: { id: customNodeUrl }
  };
  const sameCase = cloneableGenerator(handleRemoveCustomNode)(action);
  let diffCase: SagaIteratorClone;

  it('Should select getNodeId', () => {
    expect(sameCase.next().value).toEqual(select(getNodeId));
  });

  it('Should put changeNodeForce to default network if current node id === removed node id', () => {
    diffCase = sameCase.clone();
    expect(sameCase.next(customNodeUrl).value).toEqual(
      put(changeNodeForce(selectedNodeInitialState.nodeId))
    );
  });

  it('Should do nothing if current node id !== removed node id', () => {
    expect(diffCase.next('Different').done).toBeTruthy();
  });
});
