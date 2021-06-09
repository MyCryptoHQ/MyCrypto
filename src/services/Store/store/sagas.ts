import { all } from 'redux-saga/effects';

import { hdWalletSaga } from '@features/AddAccount/components/hdWallet.slice';
import { signMessageSaga } from '@features/SignAndVerifyMessage';
import { analyticsSaga } from '@services/Analytics';

import { accountsSaga } from './account.slice';
import { assetSaga } from './asset.slice';
import { ensSaga } from './ens.slice';
import { fetchMembershipsSaga } from './membership.slice';
import { networkSaga } from './network.slice';
import { notificationSaga } from './notification.slice';
import { persistenceSaga } from './persistence.slice';
import { ratesSaga } from './rates.slice';
import { importSaga } from './root.reducer';
import { settingsSaga } from './settings.slice';
import { scanTokensSaga } from './tokenScanning.sagas';
import { txHistorySaga } from './txHistory.slice';

export default function* rootSaga() {
  yield all([
    fetchMembershipsSaga(),
    hdWalletSaga(),
    accountsSaga(),
    settingsSaga(),
    networkSaga(),
    assetSaga(),
    importSaga(),
    scanTokensSaga(),
    analyticsSaga(),
    persistenceSaga(),
    ratesSaga(),
    signMessageSaga(),
    txHistorySaga(),
    ensSaga(),
    notificationSaga()
  ]);
}
