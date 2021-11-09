import { useState } from 'react';

import { Wallet } from '@mycrypto/wallets';
import styled from 'styled-components';

import { Body, BusyBottom, Heading, Icon, InlineMessage, TIcon } from '@components';
import { HARDWARE_CONFIG, WALLETS_CONFIG } from '@config';
import { WalletFactory } from '@services/WalletService';
import { getWalletConnection, useSelector } from '@store';
import { FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import {
  BusyBottomConfig,
  HardwareWalletId,
  HardwareWalletService,
  IAccount,
  IPendingTxReceipt,
  ISignedTx,
  ITxObject
} from '@types';
import { makeTransaction, useInterval } from '@utils';
import { useDebounce } from '@vendor';

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
  const [wallet, setWallet] = useState<Wallet | undefined>();
  const SigningWalletService = WalletFactory[
    senderAccount.wallet as HardwareWalletId
  ] as HardwareWalletService;
  const params = useSelector(getWalletConnection(senderAccount.wallet));

  useInterval(
    async () => {
      // Unlock Wallet
      if (!isWalletUnlocked && !isRequestingWalletUnlock) {
        setIsRequestingWalletUnlock(true);
        const walletObject = await SigningWalletService.init({
          address: senderAccount.address,
          dPath: senderAccount.path!,
          index: senderAccount.index!,
          params
        });
        try {
          await walletObject.getAddress();
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

  useDebounce(
    () => {
      // Wallet has been unlocked. Attempting to sign tx now.
      if (wallet && !isRequestingTxSignature) {
        setIsRequestingTxSignature(true);
        const madeTx = makeTransaction(rawTransaction);
        wallet
          .signTransaction(madeTx)
          .then((data) => {
            // User approves tx.
            setIsTxSignatureRequestDenied(false);
            onSuccess(data);
          })
          .catch((err) => {
            console.error(err);
            // User denies tx, or tx times out.
            setIsTxSignatureRequestDenied(true);
            setIsRequestingTxSignature(false);
          });
      }
    },
    1000,
    [wallet, isRequestingTxSignature]
  );

  const walletType = HARDWARE_CONFIG[senderAccount.wallet as HardwareWalletId].busyBottom;

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
      {wallet === BusyBottomConfig.LEDGER && (
        <Body textAlign="center" fontWeight="bold">
          {translateRaw('LEDGER_FIRMWARE_NOTICE')}
        </Body>
      )}
      <SFooter>
        <BusyBottom type={wallet} />
      </SFooter>
    </div>
  </>
);
