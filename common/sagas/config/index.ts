import { network } from './network';
import { node } from './node';
import { web3 } from './web3';
import { all } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

export default function*(): SagaIterator {
  yield all([...network, ...node, ...web3]);
}
