import { useState } from 'react';

import { parse } from '@ethersproject/transactions';
import { TAddress, Wallet } from '@mycrypto/wallets';
import styled from 'styled-components';

import { Body, Box, BusyBottom, Heading, Icon, InlineMessage, TIcon } from '@components';
import { TxIntermediaryDisplay } from '@components/TransactionFlow/displays';
import { isContractInteraction } from '@components/TransactionFlow/helpers';
import { HARDWARE_CONFIG, WALLETS_CONFIG } from '@config';
import { WalletFactory } from '@services/WalletService';
import {
  connectWallet,
  getContractName,
  getWalletConnection,
  useDispatch,
  useSelector
} from '@store';
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
import { isSameAddress, makeTransaction, useInterval } from '@utils';
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

export enum WalletSigningState {
  SUBMITTING,
  REJECTED,
  SUCCESS,
  ADDRESS_MISMATCH,
  PENDING
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
  const [signingState, setSigningState] = useState(WalletSigningState.PENDING);
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
      if (
        wallet &&
        ![WalletSigningState.SUBMITTING, WalletSigningState.SUCCESS].includes(signingState)
      ) {
        setSigningState(WalletSigningState.SUBMITTING);
        const madeTx = makeTransaction(rawTransaction);
        wallet
          .signTransaction(madeTx)
          .then((data) => {
            const parsed = parse(data);
            if (!isSameAddress(senderAccount.address, parsed.from as TAddress)) {
              setSigningState(WalletSigningState.ADDRESS_MISMATCH);
              return;
            }
            // User approves tx.
            setSigningState(WalletSigningState.SUCCESS);
            onSuccess(data);
          })
          .catch((err) => {
            console.error(err);
            // User denies tx, or tx times out.
            setSigningState(WalletSigningState.REJECTED);
          });
      }
    },
    1000,
    [wallet, signingState]
  );

  const walletType = HARDWARE_CONFIG[senderAccount.wallet as HardwareWalletId].busyBottom;
  const network = senderAccount.networkId;
  const contractName = useSelector(getContractName(network, rawTransaction.to));

  return (
    <SignTxHardwareUI
      walletIconType={walletIconType}
      signerDescription={signerDescription}
      signingState={signingState}
      wallet={walletType}
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      contractName={contractName}
    />
  );
}

interface UIProps {
  walletIconType: TIcon;
  signerDescription: string;
  signingState: WalletSigningState;
  wallet: BusyBottomConfig;
  senderAccount: IAccount;
  rawTransaction: ITxObject;
  contractName?: string;
}

export const SignTxHardwareUI = ({
  walletIconType,
  signerDescription,
  signingState,
  wallet,
  senderAccount,
  rawTransaction,
  contractName
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
    {isContractInteraction(rawTransaction.data) && rawTransaction.to && (
      <Box mt={3}>
        <TxIntermediaryDisplay address={rawTransaction.to} contractName={contractName} />
      </Box>
    )}
    <div>
      <SImgContainer>
        <Icon type={walletIconType} />
      </SImgContainer>
      <Box variant="columnCenter" pt={SPACING.SM}>
        {signingState === WalletSigningState.REJECTED && (
          <SInlineMessage value={translate('SIGN_TX_HARDWARE_FAILED_1')} />
        )}
        {signingState === WalletSigningState.ADDRESS_MISMATCH && (
          <SInlineMessage
            value={translateRaw('HW_SIGN_ADDRESS_MISMATCH', { $address: senderAccount.address })}
          />
        )}
        {signingState === WalletSigningState.SUBMITTING && (
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
