import { getWalletInst } from 'selectors/wallet';
import { IFullWallet } from 'libs/wallet';
import { getGasPriceGwei, getNetworkConfig } from 'selectors/config';
import { select, call, put, take } from 'redux-saga/effects';
import { toWei, getDecimalFromEtherUnit, Wei } from 'libs/units';
import {
  signTransactionFailed,
  SignWeb3TransactionRequestedAction,
  SignLocalTransactionRequestedAction,
  GetFromFailedAction,
  GetFromSucceededAction,
  getFromRequested,
  TypeKeys as TK
} from 'actions/transaction';
import Tx from 'ethereumjs-tx';
import { NetworkConfig } from 'config/data';
import { SagaIterator } from 'redux-saga';
import { showNotification } from 'actions/notifications';
import { toBuffer } from 'ethereumjs-util';

import {
  signTransactionWrapper,
  getGasPrice,
  getWalletAndTransaction,
  handleFailedTransaction,
  getFrom
} from 'sagas/transaction/signing/helpers';

describe('signTransactionnWrapper*', () => {
  it('should do stuff', () => {
    //
  });
});
