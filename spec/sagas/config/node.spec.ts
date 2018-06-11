import { configuredStore } from 'store';
import { cloneableGenerator, SagaIteratorClone } from 'redux-saga/utils';
import {
  handleNodeChangeForce,
  handleChangeNetworkRequested,
  handleRemoveCustomNode
} from 'sagas/config/node';
import { put, select } from 'redux-saga/effects';
import { isStaticNodeId, getStaticNodeFromId, getNodeId, getAllNodes } from 'selectors/config';
import {
  TypeKeys,
  changeNodeSucceeded,
  changeNodeRequested,
  changeNodeForce,
  ChangeNetworkRequestedAction,
  RemoveCustomNodeAction
} from 'actions/config';
import { makeAutoNodeName } from 'libs/nodes';
import { INITIAL_STATE as selectedNodeInitialState } from 'reducers/config/nodes/selectedNode';
import { CustomNodeConfig } from 'types/node';

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
        changeNodeSucceeded({
          networkId: nodeConfig.network,
          nodeId: payload
        })
      )
    );
  });

  it('should put a change node intent', () => {
    expect(gen.next().value).toEqual(put(changeNodeRequested(payload)));
  });

  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
});

describe('handleChangeNetworkRequested*', () => {
  const action: ChangeNetworkRequestedAction = {
    payload: 'ETH',
    type: TypeKeys.CONFIG_CHANGE_NETWORK_REQUESTED
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
  const gen = cloneableGenerator(handleChangeNetworkRequested);
  const staticCase = gen(action);
  let customCase: SagaIteratorClone;
  let failureCase: SagaIteratorClone;

  it('should select isStaticNodeId', () => {
    expect(staticCase.next().value).toEqual(select(isStaticNodeId, nextNodeName));
  });

  it('should put changeNodeRequested for auto node if static network', () => {
    customCase = staticCase.clone();
    expect(staticCase.next(true).value).toEqual(put(changeNodeRequested(nextNodeName)));
    expect(staticCase.next().done).toBeTruthy();
  });

  it('should select getAllNodes if non-static network', () => {
    expect(customCase.next(false).value).toEqual(select(getAllNodes));
  });

  it('should put changeNodeRequested on the first custom node if found', () => {
    failureCase = customCase.clone();
    expect(customCase.next([customNode]).value).toEqual(put(changeNodeRequested(customNode.id)));
  });

  it('should put showNotification if not a valid network', () => {
    const value = failureCase.next([]).value as any;
    expect(value.PUT.action.type).toBe('SHOW_NOTIFICATION');
  });
});

describe('handleRemoveCustomNode*', () => {
  const customNodeUrl = 'https://mycustomnode.com';
  const action: RemoveCustomNodeAction = {
    type: TypeKeys.CONFIG_REMOVE_CUSTOM_NODE,
    payload: customNodeUrl
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
