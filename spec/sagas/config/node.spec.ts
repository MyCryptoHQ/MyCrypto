import { configuredStore } from 'store';
import { cloneableGenerator } from 'redux-saga/utils';
import { handleNodeChangeForce } from 'sagas/config/node';
import { put, select } from 'redux-saga/effects';
import { isStaticNodeId, getStaticNodeFromId } from 'selectors/config';
import { changeNode, changeNodeIntent } from 'actions/config';

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
