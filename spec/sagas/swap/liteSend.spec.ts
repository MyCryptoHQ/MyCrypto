import { configuredStore } from 'store';
import { cloneableGenerator, createMockTask } from 'redux-saga/utils';
import { take, race, fork } from 'redux-saga/effects';
import { TypeKeys as TransactionTK } from 'actions/transaction';
import { TypeKeys as WalletTK } from 'actions/wallet';
import { TypeKeys as SwapTK } from 'actions/swap/constants';
import { configureLiteSendSaga, handleConfigureLiteSend } from 'sagas/swap/liteSend';

// init module
configuredStore.getState();

describe('Testing handle configure lite send', () => {
  const generators = {
    original: cloneableGenerator(handleConfigureLiteSend)()
  };
  const { original } = generators;

  it('forks a configureLiteSend saga', () => {
    const expectedYield = fork(configureLiteSendSaga);
    expect(original.next().value).toEqual(expectedYield);
  });

  it('races between three conditions, either the transaction state is reset, the user navigated away from the page, or bitty/shapeshift polling as finished', () => {
    const mockedTask = createMockTask();
    const expectedYield = race({
      transactionReset: take(TransactionTK.RESET),
      userNavigatedAway: take(WalletTK.WALLET_RESET),
      bityPollingFinished: take(SwapTK.SWAP_STOP_POLL_BITY_ORDER_STATUS),
      shapeshiftPollingFinished: take(SwapTK.SWAP_STOP_POLL_SHAPESHIFT_ORDER_STATUS)
    });

    expect(original.next(mockedTask).value).toEqual(expectedYield);
  });
});
