import { takeEvery } from 'redux-saga/effects';

import type { Yield, Return, Next } from 'sagas/types';

// @HACK For now we reload the app when doing a language swap to force non-connected
// data to reload. Also the use of timeout to avoid using additional actions for now.
function* handleLanguageChange(): Generator<Yield, Return, Next> {
  yield setTimeout(() => location.reload(), 250);
}

export default function* handleConfigChanges(): Generator<Yield, Return, Next> {
  yield takeEvery('CONFIG_LANGUAGE_CHANGE', handleLanguageChange);
}
