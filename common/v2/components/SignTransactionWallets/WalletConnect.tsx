import React, { useEffect, useReducer, useState } from 'react';

import translate, { translateRaw } from 'v2/translations';
import {
  WalletConnectQr,
  Button,
  Spinner,
  walletConnectReducer,
  WalletConnectReducer
} from 'v2/components';
import { WalletId, ISignComponentProps } from 'v2/types';
import { WALLETS_CONFIG } from 'v2/config';
import WalletConnectItem from 'v2/services/WalletService/walletconnect/walletConnect';

import { InlineErrorMsg } from '../ErrorMessages';
import './WalletConnect.scss';

interface WalletConnectAddress {
  address: string;
  chainId: number;
}

export enum WalletSigningState {
  READY, // when signerWallet is ready to sendTransaction
  UNKNOWN // used upon component initialization when wallet status is not determined
}

export interface IWalletConnectState {
  isCorrectAddress: boolean;
  isCorrectNetwork: boolean;
  detectedAddress: string;
  signingError: string;
  walletSigningState: WalletSigningState;
  displaySignReadyQR: boolean;
  isPendingTx: boolean;
  isConnected: boolean;
}

export const initialWalletConnectState: IWalletConnectState = {
  isCorrectAddress: false,
  isCorrectNetwork: false,
  detectedAddress: '',
  signingError: '',
  walletSigningState: WalletSigningState.UNKNOWN,
  displaySignReadyQR: false,
  isPendingTx: false,
  isConnected: false
};

export type WalletConnectQrContent = WalletConnectAddress;

const wikiLink = WALLETS_CONFIG[WalletId.WALLETCONNECT].helpLink!;

export function SignTransactionWalletConnect({
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  const WalletConnectService = new WalletConnectItem();

  const [state, dispatch] = useReducer(walletConnectReducer, initialWalletConnectState);
  const [displaySignReadyQR, setDisplaySignReadyQR] = useState(false);

  const detectAddress = ({
    address: currentWalletConnectAddress,
    chainId: currentWalletConnectChainId
  }: WalletConnectQrContent) => {
    dispatch({
      type: WalletConnectReducer.DETECT_ADDRESS,
      payload: {
        address: currentWalletConnectAddress,
        chainId: currentWalletConnectChainId,
        senderAccount,
        rawTransaction
      }
    });
  };

  const promptSignTransaction = async () => {
    if (!state.isConnected || !state.isCorrectNetwork || !state.isCorrectAddress) return;
    dispatch({
      type: WalletConnectReducer.BROADCAST_SIGN_TX,
      payload: { isPendingTx: true }
    });
    WalletConnectService.sendTransaction({ from: state.detectedAddress, ...rawTransaction })
      .then((txHash: string) => {
        onSuccess(txHash);
      })
      .catch((err: any) => {
        dispatch({
          type: WalletConnectReducer.BROADCAST_SIGN_TX_ERROR,
          payload: { errMsg: err.message }
        });
      });
  };

  // Used to prompt for signature
  useEffect(() => {
    if (
      !state.isCorrectAddress ||
      !state.isCorrectNetwork ||
      !state.isConnected ||
      state.walletSigningState === WalletSigningState.READY
    )
      return;
    dispatch({
      type: WalletConnectReducer.SET_WALLET_SIGNING_STATE_READY
    });
  });

  // Used to trigger signTransaction
  useEffect(() => {
    if (state.walletSigningState !== WalletSigningState.READY) return;
    // Resubmits the transaction for signature on tx rejection.
    const walletSigner = setInterval(() => {
      if (state.isPendingTx) return;
      promptSignTransaction();
    }, 2000);
    return () => clearInterval(walletSigner);
  });

  return (
    <div className="WalletConnectPanel">
      <div className="Panel-title">
        {translate('SIGNER_SELECT_WALLETCONNECT', { $walletId: translateRaw('X_WALLETCONNECT') })}
      </div>
      {state.walletSigningState !== WalletSigningState.READY &&
        !state.isCorrectAddress &&
        !state.isCorrectNetwork && (
          <section className="Panel-description">
            {translate('SIGNER_SELECT_WALLET_QR', {
              $walletId: translateRaw('X_WALLETCONNECT')
            })}
          </section>
        )}
      <div className="WalletConnect">
        <section className="WalletConnect-fields">
          {state.walletSigningState === WalletSigningState.READY && (
            <>
              <div className="WalletConnect-fields-field">
                {translate('SIGN_TX_WALLETCONNECT_PENDING', {
                  $address: state.detectedAddress
                })}
              </div>
              {state.signingError !== '' && (
                <div className="WalletConnect-fields-error">
                  <InlineErrorMsg>
                    {translate('SIGN_TX_WALLETCONNECT_REJECTED', {
                      $walletName: translateRaw('X_WALLETCONNECT'),
                      $address: senderAccount.address
                    })}
                  </InlineErrorMsg>
                </div>
              )}
              {state.isPendingTx && (
                <div className="WalletConnect-fields-spinner">
                  <Spinner />
                </div>
              )}
            </>
          )}

          {state.isConnected && !state.isCorrectAddress && (
            <div className="WalletConnect-fields-field">
              {translate('SIGN_TX_WALLETCONNECT_FAILED_ACCOUNT', {
                $walletName: translateRaw('X_WALLETCONNECT'),
                $address: senderAccount.address
              })}
            </div>
          )}
          {state.isConnected && !state.isCorrectNetwork && (
            <div className="WalletConnect-fields-field">
              {translate('SIGN_TX_WALLETCONNECT_FAILED_NETWORK', {
                $walletName: translateRaw('X_WALLETCONNECT'),
                $network: senderAccount.networkId
              })}
            </div>
          )}
          {state.walletSigningState === WalletSigningState.READY && (
            <div className="WalletConnect-fields-field">
              <Button
                basic={true}
                className="WalletConnect-qr-code-option"
                onClick={() => setDisplaySignReadyQR(!displaySignReadyQR)}
              >
                {displaySignReadyQR
                  ? translateRaw('SIGN_TX_WALLETCONNECT_HIDE_QR')
                  : translateRaw('SIGN_TX_WALLETCONNECT_SHOW_QR')}
              </Button>
              {state.displaySignReadyQR && (
                <section className="WalletConnect-fields-field">
                  <WalletConnectQr scan={true} onScan={detectAddress} />
                </section>
              )}
            </div>
          )}
        </section>
        {!(state.walletSigningState === WalletSigningState.READY) && (
          <section className="WalletConnect-fields-field">
            <WalletConnectQr scan={true} onScan={detectAddress} />
          </section>
        )}
        {wikiLink && (
          <p className="WalletConnect-wiki-link">
            {translate('ADD_WALLETCONNECT_LINK', { $wiki_link: wikiLink })}
          </p>
        )}
      </div>
    </div>
  );
}

export default SignTransactionWalletConnect;
