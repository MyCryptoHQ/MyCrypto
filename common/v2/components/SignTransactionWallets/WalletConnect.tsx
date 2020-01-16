import React, { useState, useEffect } from 'react';

import translate, { translateRaw } from 'v2/translations';
import { WalletConnectQr, Button, Spinner } from 'v2/components';
import { WalletId, ISignComponentProps } from 'v2/types';
import { WALLETS_CONFIG } from 'v2/config';
import WalletConnectItem from 'v2/services/WalletService/walletconnect/walletConnect';
import { InlineErrorMsg } from '../ErrorMessages';

import './WalletConnect.scss';

interface WalletConnectAddress {
  address: string;
  chainId: number;
}

enum WalletSigningState {
  READY, // when signerWallet is ready to sendTransaction
  UNKNOWN // used upon component initialization when wallet status is not determined
}

export type WalletConnectQrContent = WalletConnectAddress;

const wikiLink = WALLETS_CONFIG[WalletId.WALLETCONNECT].helpLink!;

export function SignTransactionWalletConnect({
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  const WalletConnectService = new WalletConnectItem();
  const [isCorrectAddress, setIsCorrectAddress] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('');
  const [signingError, setSigningError] = useState('');
  const [walletSigningState, setWalletSigningState] = useState(WalletSigningState.UNKNOWN);
  const [displaySignReadyQR, setDisplaySignReadyQR] = useState(false);
  const [isPendingTx, setIsPendingTx] = useState(false);

  const detectAddress = ({
    address: currentWalletConnectAddress,
    chainId: currentWalletConnectChainId
  }: WalletConnectQrContent) => {
    setIsConnected(true);
    setDetectedAddress(currentWalletConnectAddress);
    setIsCorrectAddress(
      currentWalletConnectAddress.toLowerCase() === senderAccount.address.toLowerCase()
    );
    setIsCorrectNetwork(currentWalletConnectChainId === rawTransaction.chainId);
  };

  const promptSignTransaction = async () => {
    if (!isConnected || !isCorrectNetwork || !isCorrectAddress) return;
    setIsPendingTx(true);
    WalletConnectService.sendTransaction({ from: detectedAddress, ...rawTransaction })
      .then(txHash => {
        setIsPendingTx(false);
        onSuccess(txHash);
      })
      .catch((err: any) => {
        setIsPendingTx(false);
        setSigningError(err.message);
      });
  };

  // Used to prompt for signature
  useEffect(() => {
    if (!isCorrectAddress || !isCorrectNetwork || !isConnected) {
      setSigningError('');
      return;
    }
    setWalletSigningState(WalletSigningState.READY);
  });

  // Used to trigger signTransaction
  useEffect(() => {
    if (walletSigningState !== WalletSigningState.READY) return;
    // Resubmits the transaction for signature on tx rejection.
    const walletSigner = setInterval(() => {
      if (isPendingTx) return;
      promptSignTransaction();
    }, 3000);
    return () => clearInterval(walletSigner);
  });

  return (
    <div className="WalletConnectPanel">
      <div className="Panel-title">
        {translate('SIGNER_SELECT_WALLETCONNECT', { $walletId: translateRaw('X_WALLETCONNECT') })}
      </div>
      <div className="WalletConnect">
        <section className="WalletConnect-fields">
          {walletSigningState === WalletSigningState.READY && (
            <>
              <div className="WalletConnect-fields-field">
                {translate('SIGN_TX_WALLETCONNECT_PENDING', {
                  $address: detectedAddress
                })}
              </div>
              <div className="WalletConnect-fields">
                {signingError !== '' && (
                  <InlineErrorMsg>
                    {translate('SIGN_TX_WALLETCONNECT_REJECTED', {
                      $walletName: translateRaw('X_WALLETCONNECT'),
                      $address: senderAccount.address
                    })}
                  </InlineErrorMsg>
                )}
              </div>
              {isPendingTx && (
                <div className="WalletConnect-fields-spinner">
                  <Spinner />
                </div>
              )}
            </>
          )}

          {isConnected && !isCorrectAddress && (
            <div className="WalletConnect-fields-field">
              {translate('SIGN_TX_WALLETCONNECT_FAILED_ACCOUNT', {
                $walletName: translateRaw('X_WALLETCONNECT'),
                $address: senderAccount.address
              })}
            </div>
          )}
          {isConnected && !isCorrectNetwork && (
            <div className="WalletConnect-fields-field">
              {translate('SIGN_TX_WALLETCONNECT_FAILED_NETWORK', {
                $walletName: translateRaw('X_WALLETCONNECT'),
                $network: senderAccount.networkId
              })}
            </div>
          )}
          {walletSigningState === WalletSigningState.READY && (
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
              {displaySignReadyQR && (
                <section className="WalletConnect-fields-field-margin">
                  <WalletConnectQr scan={true} onScan={detectAddress} />
                </section>
              )}
            </div>
          )}
        </section>
        {!(walletSigningState === WalletSigningState.READY) && (
          <>
            <section className="Panel-description">
              {translate('SIGNER_SELECT_WALLET_QR', {
                $walletId: translateRaw('X_WALLETCONNECT')
              })}
            </section>
            <section className="WalletConnect-fields-field">
              <WalletConnectQr scan={true} onScan={detectAddress} />
            </section>
          </>
        )}
        {wikiLink && <p>{translate('ADD_WALLETCONNECT_LINK', { $wiki_link: wikiLink })}</p>}
      </div>
    </div>
  );
}

export default SignTransactionWalletConnect;
