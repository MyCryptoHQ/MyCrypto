import { SagaIterator } from 'redux-saga';
import { all } from 'redux-saga/effects';
import { broadcast } from './broadcast';
import { current } from './current';
import { fields } from './fields';
import { meta } from './meta';
import { network } from './network';
import { signing } from './signing';
import { sendEverything } from './sendEverything';
import { reset } from './reset';

export function* transaction(): SagaIterator {
  yield all([
    ...broadcast,
    ...current,
    ...fields,
    ...meta,
    ...network,
    ...signing,
    ...sendEverything,
    ...reset
  ]);
}
