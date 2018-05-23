import { network } from './network';
import { node } from './node';
import { web3 } from './web3';
import { updateTokens } from './update-tokens';
import { all } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

export default function*(): SagaIterator {
  yield all([...network, ...node, ...web3, ...updateTokens]);
}
