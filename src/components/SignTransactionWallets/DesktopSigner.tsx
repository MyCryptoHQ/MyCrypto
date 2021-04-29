import React, { useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';

import myCryptoIcon from '@assets/icons/brand/logo.svg';
import { WALLETS_CONFIG } from '@config';
import { getNetworkByChainId, useNetworks } from '@services/Store';
import { getKeyPair, useSelector } from '@store';
import translate, { translateRaw } from '@translations';
import { ISignComponentProps } from '@types';
import { isVoid } from '@utils';
import { createSignerProvider } from '@utils/signerProvider';

enum WalletSigningState {
  READY, //when signerWallet is ready to sendTransaction
  NOT_READY, //use when signerWallet rejects transaction
  UNKNOWN //used upon component initialization when wallet status is not determined
}

const SignTransactionDesktopSigner = ({
  rawTransaction,
  senderAccount,
  onSuccess
}: ISignComponentProps) => {
  const { networks } = useNetworks();
  const { publicKey, privateKey } = useSelector(getKeyPair);
  const detectedNetwork = getNetworkByChainId(rawTransaction.chainId, networks);

  const [submitting, setSubmitting] = useState(false);
  const [walletState, setWalletState] = useState(WalletSigningState.UNKNOWN);
  const [error, setError] = useState('');

  const ws = createSignerProvider(privateKey, publicKey);

  const ethersProvider = new Web3Provider(ws, detectedNetwork!.chainId);

  useEffect(() => {
    if (!submitting) {
      setSubmitting(true);
      ethersProvider
        .getSigner()
        .provider.send('eth_signTransaction', [{ ...rawTransaction, from: senderAccount.address }])
        .then((txHash) => {
          onSuccess(txHash);
        })
        .catch((err) => {
          setSubmitting(false);
          console.debug(`[SignTransactionWeb3] ${err.message}`);
          setError(err.message);
          if (err.message.includes('User denied transaction signature')) {
            setWalletState(WalletSigningState.NOT_READY);
          }
        });
    }
  });

  return (
    <>
      <div className="SignTransactionWeb3-title">
        {translate('SIGN_TX_TITLE', {
          $walletName: WALLETS_CONFIG.DESKTOP_SIGNER.name
        })}
      </div>
      <div className="SignTransactionWeb3-instructions">
        {translate('SIGN_TX_WEB3_PROMPT', {
          $walletName: WALLETS_CONFIG.DESKTOP_SIGNER.name
        })}
      </div>
      <div className="SignTransactionWeb3-img">
        <img src={myCryptoIcon} />
      </div>
      {walletState === WalletSigningState.NOT_READY ? (
        <div className="SignTransactionWeb3-rejection">{translate('SIGN_TX_WEB3_REJECTED')}</div>
      ) : null}

      <div className="SignTransactionWeb3-input">
        <div className="SignTransactionWeb3-errors">{!isVoid(error) && error}</div>
        {submitting && translate('SIGN_TX_SUBMITTING_PENDING')}
        <div className="SignTransactionWeb3-description">{translateRaw('SIGN_TX_EXPLANATION')}</div>
      </div>
    </>
  );
};

export default SignTransactionDesktopSigner;
