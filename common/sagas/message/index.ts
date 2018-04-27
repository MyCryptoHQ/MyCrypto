import { SagaIterator } from 'redux-saga';
import { all } from 'redux-saga/effects';
import { signing } from './signing';

export function* message(): SagaIterator {
  yield all([...signing]);
}
