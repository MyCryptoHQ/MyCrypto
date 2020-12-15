import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { InlineMessage } from '@components';
import { WALLETS_CONFIG } from '@config';
import { HardwareWallet, WalletFactory } from '@services/WalletService';
import translate, { translateRaw } from '@translations';
import { IAccount, IPendingTxReceipt, ISignedTx, ITxObject, WalletId } from '@types';
import { makeTransaction, useInterval } from '@utils';

export interface IDestructuredDPath {
  dpath: string;
  index: number;
}

const SReferral = styled.div`
  text-align: center;
  font-size: 16px;
`;
const SHelp = styled.div`
  margin-top: 1em;
  text-align: center;
  font-size: 16px;
`;

const SFooter = styled.div`
  width: 100%;
`;

const SDescription = styled.div`
  font-size: 18px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 1em;
`;

const SImgContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 3em;
`;

const STitle = styled.div`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin-top: 40px;
`;

const SInstructions = styled.div`
  padding-top: 2em;
  font-size: 18px;
  line-height: 1.5;
  text-align: center;
`;

const ErrorMessageContainer = styled.div`
  margin: 2em;
`;

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

  const helpCopy = (() => {
    switch (senderAccount.wallet) {
      case WalletId.TREZOR:
      case WalletId.TREZOR_NEW:
        return 'TREZOR_HELP';

      default:
        return 'LEDGER_HELP';
    }
  })();

  const referralCopy = (() => {
    switch (senderAccount.wallet) {
      case WalletId.TREZOR:
      case WalletId.TREZOR_NEW:
        return 'TREZOR_REFERRAL';

      default:
        return 'LEDGER_REFERRAL';
    }
  })();

  return (
    <SignTxHardwareUI
      walletIcon={walletIcon}
      signerDescription={signerDescription}
      isTxSignatureRequestDenied={isTxSignatureRequestDenied}
      helpCopy={helpCopy}
      referralCopy={referralCopy}
      senderAccount={senderAccount}
    />
  );
}

interface UIProps {
  walletIcon: any;
  signerDescription: string;
  isTxSignatureRequestDenied: boolean;
  helpCopy: string;
  referralCopy: string;
  senderAccount: IAccount;
}

export const SignTxHardwareUI = ({
  walletIcon,
  signerDescription,
  isTxSignatureRequestDenied,
  helpCopy,
  referralCopy,
  senderAccount
}: UIProps) => (
  <>
    <STitle>
      {translate('SIGN_TX_TITLE', {
        $walletName: WALLETS_CONFIG[senderAccount.wallet].name
      })}
    </STitle>
    <SInstructions>{signerDescription}</SInstructions>
    <div>
      <SImgContainer>
        <img src={walletIcon} />
      </SImgContainer>
      <SDescription>
        {isTxSignatureRequestDenied && (
          <ErrorMessageContainer>
            <InlineMessage value={translate('SIGN_TX_HARDWARE_FAILED_1')} />
          </ErrorMessageContainer>
        )}
        {translateRaw('SIGN_TX_EXPLANATION')}
      </SDescription>
      <SFooter>
        <SHelp>{translate(helpCopy)}</SHelp>
        <SReferral>{translate(referralCopy)}</SReferral>
      </SFooter>
    </div>
  </>
);
