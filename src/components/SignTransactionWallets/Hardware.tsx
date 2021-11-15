import { useState } from 'react';

import { Wallet } from '@mycrypto/wallets';
import styled from 'styled-components';

import { Body, Box, BusyBottom, Heading, Icon, InlineMessage, TIcon } from '@components';
import { HARDWARE_CONFIG, WALLETS_CONFIG } from '@config';
import { WalletFactory } from '@services/WalletService';
import { connectWallet, getWalletConnection, useDispatch, useSelector } from '@store';
import { FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import {
  BusyBottomConfig,
  HardwareWalletId,
  HardwareWalletService,
  IAccount,
  InlineMessageType,
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

const SInlineMessage = styled(InlineMessage)`
  text-align: center;
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
  const dispatch = useDispatch();

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
        dispatch(connectWallet(walletObject));
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
        setIsTxSignatureRequestDenied(false);
        const madeTx = makeTransaction(rawTransaction);
        wallet
          .signTransaction(madeTx)
          .then((data) => {
            // User approves tx.
            setIsTxSignatureRequestDenied(false);
            setIsRequestingTxSignature(false);
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
      isRequestingTxSignature={isRequestingTxSignature}
      wallet={walletType}
      senderAccount={senderAccount}
    />
  );
}

interface UIProps {
  walletIconType: TIcon;
  signerDescription: string;
  isTxSignatureRequestDenied: boolean;
  isRequestingTxSignature: boolean;
  wallet: BusyBottomConfig;
  senderAccount: IAccount;
}

export const SignTxHardwareUI = ({
  walletIconType,
  signerDescription,
  isTxSignatureRequestDenied,
  isRequestingTxSignature,
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
      <Box variant="columnCenter" pt={SPACING.SM}>
        {isTxSignatureRequestDenied && (
          <SInlineMessage value={translate('SIGN_TX_HARDWARE_FAILED_1')} />
        )}
        {isRequestingTxSignature && (
          <SInlineMessage type={InlineMessageType.INDICATOR_INFO_CIRCLE}>
            {translate('SIGN_TX_SUBMITTING_PENDING')}
          </SInlineMessage>
        )}
      </Box>
      <Body textAlign="center" lineHeight="1.5" fontSize={FONT_SIZE.MD} marginTop="16px">
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
