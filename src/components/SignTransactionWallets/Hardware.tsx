import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Body, BusyBottom, Heading, Icon, InlineMessage, TIcon } from '@components';
import { WALLETS_CONFIG } from '@config';
import { HardwareWallet, WalletFactory } from '@services/WalletService';
import { FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import {
  BusyBottomConfig,
  HardwareWalletId,
  HardwareWalletService,
  IAccount,
  IPendingTxReceipt,
  ISignedTx,
  ITxObject,
  WalletId
} from '@types';
import { makeTransaction, useInterval } from '@utils';

export interface IDestructuredDPath {
  dpath: string;
  index: number;
}

const SFooter = styled.div`
  width: 100%;
`;

const SImgContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 3em;
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
  walletIconType: TIcon;
  signerDescription: string;
  senderAccount: IAccount;
  rawTransaction: ITxObject;
  onSuccess(receipt: IPendingTxReceipt | ISignedTx): void;
}

export default function HardwareSignTransaction({
  walletIconType,
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
  const SigningWalletService = WalletFactory[
    senderAccount.wallet as HardwareWalletId
  ] as HardwareWalletService;

  useInterval(
    async () => {
      // Unlock Wallet
      if (!isWalletUnlocked && !isRequestingWalletUnlock) {
        setIsRequestingWalletUnlock(true);
        const dpathObject = splitDPath(senderAccount.dPath);
        const walletObject = SigningWalletService.init({
          address: senderAccount.address,
          dPath: dpathObject.dpath,
          index: dpathObject.index
        });
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

  const walletType = (() => {
    switch (senderAccount.wallet) {
      case WalletId.TREZOR:
      case WalletId.TREZOR_NEW:
        return BusyBottomConfig.TREZOR;

      default:
        return BusyBottomConfig.LEDGER;
    }
  })();

  return (
    <SignTxHardwareUI
      walletIconType={walletIconType}
      signerDescription={signerDescription}
      isTxSignatureRequestDenied={isTxSignatureRequestDenied}
      wallet={walletType}
      senderAccount={senderAccount}
    />
  );
}

interface UIProps {
  walletIconType: TIcon;
  signerDescription: string;
  isTxSignatureRequestDenied: boolean;
  wallet: BusyBottomConfig;
  senderAccount: IAccount;
}

export const SignTxHardwareUI = ({
  walletIconType,
  signerDescription,
  isTxSignatureRequestDenied,
  wallet,
  senderAccount
}: UIProps) => (
  <>
    <Heading textAlign="center" fontWeight="bold" fontSize={FONT_SIZE.XXL}>
      {translate('SIGN_TX_TITLE', {
        $walletName: WALLETS_CONFIG[senderAccount.wallet].name
      })}
    </Heading>
    <Body fontSize={FONT_SIZE.MD} marginTop={SPACING.MD}>
      {signerDescription}
    </Body>
    <div>
      <SImgContainer>
        <Icon type={walletIconType} />
      </SImgContainer>
      <Body textAlign="center">
        {isTxSignatureRequestDenied && (
          <ErrorMessageContainer>
            <InlineMessage value={translate('SIGN_TX_HARDWARE_FAILED_1')} />
          </ErrorMessageContainer>
        )}
        {translateRaw('SIGN_TX_EXPLANATION')}
      </Body>
      <SFooter>
        <BusyBottom type={wallet} />
      </SFooter>
    </div>
  </>
);
