import { all } from 'redux-saga/effects';

import { hdWalletSaga } from '@features/AddAccount/components/hdWallet.slice';
import { signMessageSaga } from '@features/SignAndVerifyMessage';
import { analyticsSaga } from '@services/Analytics';

import { accountsSaga } from './account.slice';
import { accountUndoSaga } from './accountUndo.slice';
import { assetSaga } from './asset.slice';
import { claimsSaga } from './claims.slice';
import { connectionsSaga } from './connections.slice';
import { ensSaga } from './ens.slice';
import { gasSaga } from './gas.slice';
import { fetchMembershipsSaga } from './membership.slice';
import { networkSaga } from './network.slice';
import { nftSaga } from './nft.slice';
import { notificationSaga } from './notification.slice';
import { persistenceSaga } from './persistence.slice';
import { promoPoapsSaga } from './promoPoaps.slice';
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
    notificationSaga(),
    claimsSaga(),
    accountUndoSaga(),
    nftSaga(),
    gasSaga(),
    promoPoapsSaga(),
    connectionsSaga()
  ]);
}
