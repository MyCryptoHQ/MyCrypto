import React, { useEffect, useState } from 'react';

import { InlineMessage } from '@components';
import { WALLETS_CONFIG } from '@config';
import { HardwareWallet, WalletFactory } from '@services/WalletService';
import translate, { translateRaw } from '@translations';
import { IAccount, IPendingTxReceipt, ISignedTx, ITxObject } from '@types';
import { makeTransaction, useInterval } from '@utils';

import './Hardware.scss';

export interface IDestructuredDPath {
  dpath: string;
  index: number;
}

export const splitDPath = (fullDPath: string): IDestructuredDPath => {
  /*
    m/44'/60'/0'/0 => { dpath: "m/44'/60'/0'", index: "0" }
  */
  const dPathArray = fullDPath.split('/');
  const index = dPathArray.pop() as string;
  return {
    dpath: dPathArray.join('/'),
    index: parseInt(index, 10)
  };
};

export interface IProps {
  walletIcon: any;
  signerDescription: string;
  senderAccount: IAccount;
  rawTransaction: ITxObject;
  onSuccess(receipt: IPendingTxReceipt | ISignedTx): void;
}

export default function HardwareSignTransaction({
  walletIcon,
  signerDescription,
  senderAccount,
  rawTransaction,
  onSuccess
}: IProps) {
  const [isRequestingWalletUnlock, setIsRequestingWalletUnlock] = useState(false);
  const [isWalletUnlocked, setIsWalletUnlocked] = useState(false);
  const [isRequestingTxSignature, setIsRequestingTxSignature] = useState(false);
  const [isTxSignatureRequestDenied, setIsTxSignatureRequestDenied] = useState(false);
  const [wallet, setWallet] = useState<HardwareWallet | undefined>();
  const SigningWalletService = WalletFactory(senderAccount.wallet);

  useInterval(
    async () => {
      // Unlock Wallet
      if (!isWalletUnlocked && !isRequestingWalletUnlock) {
        setIsRequestingWalletUnlock(true);
        const dpathObject = splitDPath(senderAccount.dPath);
        const walletObject = SigningWalletService.init(
          senderAccount.address,
          dpathObject.dpath,
          dpathObject.index
        );
        try {
          await SigningWalletService.getChainCode(dpathObject.dpath);
          setIsRequestingWalletUnlock(false);
          setIsWalletUnlocked(true);
          setWallet(walletObject);
        } catch (error) {
          setIsRequestingWalletUnlock(false);
        }
      }
    },
    3000,
    true,
    []
  );

  useEffect(() => {
    // Wallet has been unlocked. Attempting to sign tx now.
    if (wallet && 'signRawTransaction' in wallet && !isRequestingTxSignature) {
      setIsRequestingTxSignature(true);
      const madeTx = makeTransaction(rawTransaction);
      wallet
        .signRawTransaction(madeTx)
        .then((data: any) => {
          // User approves tx.
          setIsTxSignatureRequestDenied(false);
          onSuccess(data);
        })
        .catch(() => {
          // User denies tx, or tx times out.
          setIsTxSignatureRequestDenied(true);
          setIsRequestingTxSignature(false);
        });
    }
  }, [wallet, isRequestingTxSignature]);
  return (
    <>
      <div className="SignTransactionHardware-title">
        {translate('SIGN_TX_TITLE', {
          $walletName: WALLETS_CONFIG[senderAccount.wallet].name || 'Hardware Wallet'
        })}
      </div>
      <div className="SignTransactionHardware-instructions">{signerDescription}</div>
      <div className="SignTransactionHardware-content">
        <div className="SignTransactionHardware-img">
          <img src={walletIcon} />
        </div>
        <div className="SignTransactionHardware-description">
          {translateRaw('SIGN_TX_EXPLANATION')}
          {isTxSignatureRequestDenied && (
            <InlineMessage value={translate('SIGN_TX_HARDWARE_FAILED_1')} />
          )}
        </div>
        <div className="SignTransactionHardware-footer">
          <div className="SignTransactionHardware-help">
            {translate(senderAccount.wallet + '_HELP')}
          </div>
          <div className="SignTransactionHardware-referal">
            {translate(senderAccount.wallet + '_REFERRAL')}
          </div>
        </div>
      </div>
    </>
  );
}
