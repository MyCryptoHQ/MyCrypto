import { expectSaga } from 'redux-saga-test-plan';

import { fAccount } from '@fixtures';
import { IFullWallet } from '@services';
import { ISignedMessage, WalletId } from '@types';

import {
  initialState,
  messageUpdate,
  signMessage,
  signMessageFailure,
  signMessageRequest,
  signMessageReset,
  signMessageSuccess,
  signMessageWorker,
  default as slice,
  walletSelect
} from './signMessage.slice';

describe('SignMesasge slice', () => {
  it('has an initial state', () => {
    const actual = slice.reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });
  it('signMessageReset(): resets the state', () => {
    const actual = slice.reducer({ error: true, ...initialState }, signMessageReset());
    const expected = initialState;
    expect(actual).toEqual(expected);
  });
  it('signMessageRequest(): set correct status', () => {
    const actual = slice.reducer({ ...initialState }, signMessageRequest());
    const expected = { ...initialState, status: 'SIGN_REQUEST' };
    expect(actual).toEqual(expected);
  });
  it('signMessageFailure(): set correct status', () => {
    const actual = slice.reducer({ ...initialState }, signMessageFailure());
    const expected = { ...initialState, status: 'SIGN_FAILURE', error: true };
    expect(actual).toEqual(expected);
  });
  it('signMessageSuccess(): set correct status', () => {
    const target = ({ foo: 'bar' } as unknown) as ISignedMessage;
    const actual = slice.reducer({ ...initialState }, signMessageSuccess(target));
    const expected = { ...initialState, status: 'SIGN_SUCCESS', signedMessage: target };
    expect(actual).toEqual(expected);
  });
  it('messageUpdate(): updates message', () => {
    const target = 'foo';
    const actual = slice.reducer({ ...initialState }, messageUpdate(target));
    const expected = { ...initialState, message: target };
    expect(actual).toEqual(expected);
  });
  it('walletSelect(): sets the correct walletId', () => {
    const target = WalletId.TREZOR;
    const actual = slice.reducer({ ...initialState }, walletSelect(target));
    const expected = { ...initialState, walletId: target };
    expect(actual).toEqual(expected);
  });
});

describe('signMessageWorker()', () => {
  it('calls the signMessage method for the provided wallet', () => {
    const mockMessage = 'Vitalik';
    const mockWallet = ({
      getAddress: jest.fn(() => fAccount.address),
      signMessage: jest.fn(() => Promise.resolve(`signed${mockMessage}`))
    } as unknown) as IFullWallet;
    return expectSaga(signMessageWorker, signMessage({ message: mockMessage, wallet: mockWallet }))
      .put(signMessageRequest())
      .call([mockWallet, mockWallet.signMessage], mockMessage)
      .put(
        signMessageSuccess({
          address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
          msg: 'Vitalik',
          sig: '0xsignedVitalik',
          version: '2'
        })
      )
      .silentRun();
  });
});
