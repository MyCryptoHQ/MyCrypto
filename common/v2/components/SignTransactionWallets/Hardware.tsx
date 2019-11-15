import React, { useState, useEffect } from 'react';

import { ExtendedAccount as IExtendedAccount, ITxReceipt, ITxObject, ISignedTx } from 'v2/types';
import { WALLETS_CONFIG } from 'v2/config';
import { makeTransaction } from 'v2/services/EthService';
import { WalletFactory, HardwareWallet } from 'v2/services/WalletService';
import { InlineErrorMsg } from 'v2/components/ErrorMessages';

import './Hardware.scss';
import translate from 'v2/translations';

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
  senderAccount: IExtendedAccount;
  rawTransaction: ITxObject;
  onSuccess(receipt: ITxReceipt | ISignedTx): void;
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
              setIsRequestingWalletUnlock(false);
              setIsWalletUnlocked(true);
              setWallet(walletObject);
            })
            .catch((_: any) => {
              // User hasn't connected device or there was an error. Try again
              setIsRequestingWalletUnlock(false);
            });
        } catch (error) {
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
      wallet
        .signRawTransaction(madeTx)
        .then((data: any) => {
          // User approves tx.
          setIsTxSignatureRequestDenied(false);
          onSuccess(data);
        })
        .catch((_: any) => {
          // User denies tx, or tx times out.
          setIsTxSignatureRequestDenied(true);
          setIsRequestingTxSignature(false);
        });
    }
  }, [wallet, isRequestingTxSignature]);
  return (
    <>
      <div className="SignTransactionHardware-title">
        {`Sign the Transaction with your ${WALLETS_CONFIG[senderAccount.wallet].name} Wallet`}
      </div>
      <div className="SignTransactionHardware-instructions">{signerDescription}</div>
      <div className="SignTransactionHardware-content">
        <div className="SignTransactionHardware-img">
          <img src={walletIcon} />
        </div>
        <div className="SignTransactionHardware-description">
          Because we never save, store, or transmit your secret, you need to sign each transaction
          in order to send it. MyCrypto puts YOU in control of your assets.
          {isTxSignatureRequestDenied && (
            <InlineErrorMsg>
              You denied the transaction signature request, or the transaction signature request
              timed out. Please confirm the transaction signature.
            </InlineErrorMsg>
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
