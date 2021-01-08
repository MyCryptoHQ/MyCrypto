import { all } from 'redux-saga/effects';

import { watchIncrement } from '@features/DevTools/slice';
import { analyticsSaga } from '@services/Analytics';

import { accountsSaga } from './account.slice';
import { assetSaga } from './asset.slice';
import { fetchMembershipsSaga } from './membership.slice';
import { networkSaga } from './network.slice';
import { importSaga } from './root.reducer';
import { settingsSaga } from './settings.slice';
import { scanTokensSaga } from './tokenScanning.slice';
import { vaultSaga } from './vault.slice';

export default function* rootSaga() {
  yield all([
    watchIncrement(),
    fetchMembershipsSaga(),
    accountsSaga(),
    settingsSaga(),
    networkSaga(),
    assetSaga(),
    importSaga(),
    scanTokensSaga(),
    vaultSaga(),
    analyticsSaga()
  ]);
}
