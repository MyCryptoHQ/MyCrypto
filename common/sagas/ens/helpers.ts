import { select, apply, call } from 'redux-saga/effects';
import { INode } from 'libs/nodes/INode';
import { getNodeLib } from 'selectors/config';
import { SagaIterator } from 'redux-saga';

interface Params {
  to: any;
  data: any;
  decoder: any;
}

export function* makeEthCallAndDecode({ to, data, decoder }: Params): SagaIterator {
  const node: INode = yield select(getNodeLib);
  const result: string = yield apply(node, node.sendCallRequest, [{ data, to }]);
  const decodedResult = yield call(decoder, result);
  return decodedResult;
}
