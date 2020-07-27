import React, { useState, useEffect } from 'react';

import { IAccount as IIAccount, ITxObject, ISignedTx, IPendingTxReceipt } from '@types';
import { WALLETS_CONFIG } from '@config';
import { makeTransaction } from '@services/EthService';
import { WalletFactory, HardwareWallet } from '@services/WalletService';
import { InlineMessage } from '@components';
import translate, { translateRaw } from '@translations';

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
  senderAccount: IIAccount;
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

  useEffect(() => {
    // Unlock Wallet
    console.log(
      'Satochip: /src/components/SignTransactionWallets/Hardware.tsx: in useEffect() getChainCode'
    ); //debugSatochip
    const WalletLoginRequest = setInterval(() => {
      if (!isWalletUnlocked && !isRequestingWalletUnlock) {
        setIsRequestingWalletUnlock(true);
        const dpathObject = splitDPath(senderAccount.dPath);
        const walletObject = SigningWalletService.init(
          senderAccount.address,
          dpathObject.dpath,
          dpathObject.index
        );
        try {
          SigningWalletService.getChainCode(dpathObject.dpath)
            .then((_: any) => {
              // User has connected device.
              console.log(
                'Satochip: /src/components/SignTransactionWallets/Hardware.tsx: in useEffect() getChainCode.then()'
              ); //debugSatochip
              setIsRequestingWalletUnlock(false);
              setIsWalletUnlocked(true);
              setWallet(walletObject);
            })
            .catch((_: any) => {
              // User hasn't connected device or there was an error. Try again
              console.log(
                'Satochip: /src/components/SignTransactionWallets/Hardware.tsx: in useEffect() getChainCode.catch()=',
                _
              ); //debugSatochip
              setIsRequestingWalletUnlock(false);
            });
        } catch (error) {
          console.log(
            'Satochip: /src/components/SignTransactionWallets/Hardware.tsx: in useEffect() try error= ',
            error
          ); //debugSatochip
          setIsRequestingWalletUnlock(false);
        }
      }
    }, 3000);
    return () => clearInterval(WalletLoginRequest);
  });

  useEffect(() => {
    // Wallet has been unlocked. Attempting to sign tx now.
    if (wallet && 'signRawTransaction' in wallet && !isRequestingTxSignature) {
      setIsRequestingTxSignature(true);
      const madeTx = makeTransaction(rawTransaction);
      console.log(
        'Satochip: /src/components/SignTransactionWallets/Hardware.tsx: in useEffect() signRawTransaction'
      ); //debugSatochip
      wallet
        .signRawTransaction(madeTx)
        .then((data: any) => {
          console.log(
            'Satochip: /src/components/SignTransactionWallets/Hardware.tsx: in useEffect() data=',
            data
          ); //debugSatochip
          // User approves tx.
          setIsTxSignatureRequestDenied(false);
          onSuccess(data);
        })
        .catch((_: any) => {
          console.log(
            'Satochip: /src/components/SignTransactionWallets/Hardware.tsx: in useEffect() signRawTransaction catch error=',
            _
          ); //debugSatochip
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
