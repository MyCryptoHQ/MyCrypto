import React, { useEffect, useState } from 'react';

import { utils } from 'ethers';
import { Web3Provider } from 'ethers/providers/web3-provider';

import { WALLETS_CONFIG } from '@config';
import { useNetworks } from '@services/Store';
import translate, { translateRaw } from '@translations';
import { ISignComponentProps, TAddress } from '@types';
import { getWeb3Config, isSameAddress } from '@utils';

import './Web3.scss';

enum WalletSigningState {
  //READY, //when signerWallet is ready to sendTransaction
  SUBMITTING,
  NOT_READY, //use when signerWallet rejects transaction
  ADDRESS_MISMATCH,
  NETWORK_MISMATCH,
  SUCCESS,
  UNKNOWN //used upon component initialization when wallet status is not determined
}

const getWeb3Provider = async () => {
  const ethereumProvider = (window as CustomWindow).ethereum;
  await ethereumProvider.enable();
  return new Web3Provider(ethereumProvider);
};

export default function SignTransactionWeb3({
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  const [walletState, setWalletState] = useState(WalletSigningState.UNKNOWN);
  const [web3Provider, setWeb3Provider] = useState<Web3Provider | undefined>(undefined);

  const desiredAddress = utils.getAddress(senderAccount.address);

  const { getNetworkByChainId } = useNetworks();
  const detectedNetwork = getNetworkByChainId(rawTransaction.chainId);
  const networkName = detectedNetwork ? detectedNetwork.name : translateRaw('UNKNOWN_NETWORK');
  const walletConfig = getWeb3Config();

  useEffect(() => {
    getWeb3Provider().then((provider) => {
      setWeb3Provider(provider);
      const ethereumProvider = (window as CustomWindow).ethereum;
      if (ethereumProvider) {
        ethereumProvider.on('accountsChanged', attemptSign);
        ethereumProvider.on('networkChanged', attemptSign);
      } else {
        throw Error('No web3 found');
      }
      return () => {
        ethereumProvider.off('accountsChanged');
        ethereumProvider.off('networkChanged');
      };
    });
  }, []);

  useEffect(() => {
    attemptSign();
  }, [web3Provider]);

  const attemptSign = async () => {
    if (!web3Provider) {
      return;
    }

    const web3Signer = web3Provider.getSigner();
    const web3Address = await web3Signer.getAddress();
    const checksumAddress = utils.getAddress(web3Address);

    const web3Network = await web3Provider.getNetwork();
    const addressMatches = isSameAddress(checksumAddress as TAddress, desiredAddress as TAddress);
    if (!addressMatches) {
      setWalletState(WalletSigningState.ADDRESS_MISMATCH);
      return;
    }

    const web3NetworkByChainId = getNetworkByChainId(web3Network.chainId);
    if (!web3NetworkByChainId) {
      // @todo figure out error
      return;
    }

    const networkMatches = web3NetworkByChainId.name === networkName;
    if (!networkMatches) {
      setWalletState(WalletSigningState.NETWORK_MISMATCH);
      return;
    }

    setWalletState(WalletSigningState.SUBMITTING);
    const signerWallet = web3Provider.getSigner();

    // Calling ethers.js with a tx object containing a 'from' property
    // will fail https://github.com/ethers-io/ethers.js/issues/692.
    const { from, ...rawTx } = rawTransaction;
    signerWallet
      .sendUncheckedTransaction(rawTx)
      .then((txHash) => {
        setWalletState(WalletSigningState.SUCCESS);
        onSuccess(txHash);
      })
      .catch((err) => {
        console.debug(`[SignTransactionWeb3] ${err.message}`);
        if (err.message.includes('User denied transaction signature')) {
          setWalletState(WalletSigningState.NOT_READY);
        } else {
          setWalletState(WalletSigningState.UNKNOWN);
        }
      });
  };

  return (
    <>
      <div className="SignTransactionWeb3-title">
        {translate('SIGN_TX_TITLE', {
          $walletName: walletConfig.name || WALLETS_CONFIG.WEB3.name
        })}
      </div>
      <div className="SignTransactionWeb3-instructions">
        {translate('SIGN_TX_WEB3_PROMPT', {
          $walletName: walletConfig.name || WALLETS_CONFIG.WEB3.name
        })}
      </div>
      <div className="SignTransactionWeb3-img">
        <img src={walletConfig.icon} />
      </div>
      {walletState === WalletSigningState.NOT_READY ? (
        <div className="SignTransactionWeb3-rejection">{translate('SIGN_TX_WEB3_REJECTED')}</div>
      ) : null}

      <div className="SignTransactionWeb3-input">
        <div className="SignTransactionWeb3-errors">
          {walletState === WalletSigningState.NETWORK_MISMATCH && (
            <div className="SignTransactionWeb3-wrong-network">
              {translate('SIGN_TX_WEB3_FAILED_NETWORK', {
                $walletName: walletConfig.name,
                $networkName: networkName
              })}
            </div>
          )}
          {walletState === WalletSigningState.ADDRESS_MISMATCH && (
            <div className="SignTransactionWeb3-wrong-address">
              {translate('SIGN_TX_WEB3_FAILED_ACCOUNT', {
                $walletName: walletConfig.name,
                $address: senderAccount.address
              })}
            </div>
          )}
        </div>
        {walletState === WalletSigningState.SUBMITTING && translate('SIGN_TX_SUBMITTING_PENDING')}
        <div className="SignTransactionWeb3-description">{translateRaw('SIGN_TX_EXPLANATION')}</div>
        <div className="SignTransactionWeb3-footer">
          {walletConfig.helpLink && (
            <div className="SignTransactionWeb3-help">
              {translate('SIGN_TX_HELP_LINK', { $helpLink: walletConfig.helpLink })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
