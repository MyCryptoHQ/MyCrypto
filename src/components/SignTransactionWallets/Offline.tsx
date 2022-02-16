import { useMemo, useState } from 'react';

import { serialize } from '@ethersproject/transactions';
import styled from 'styled-components';

import { Body, Box, BusyBottom, Button, Heading, InputField, LinkApp } from '@components';
import { TxIntermediaryDisplay } from '@components/TransactionFlow/displays';
import { isContractInteraction } from '@components/TransactionFlow/helpers';
import { getWalletConfig, IWalletConfig, ROUTE_PATHS, WALLETS_CONFIG } from '@config';
import { useNetworks } from '@services/Store';
import { getContractName, useSelector } from '@store';
import { FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { BusyBottomConfig, ISignComponentProps, ITxObject, StoreAccount, WalletId } from '@types';
import { makeTransaction } from '@utils';

export enum WalletSigningState {
  SUBMITTING,
  REJECTED,
  ADDRESS_MISMATCH,
  NETWORK_MISMATCH,
  SUCCESS,
  UNKNOWN //used upon component initialization when wallet status is not determined
}

export function SignTransactionOffline({
  senderAccount,
  rawTransaction
}: // onSuccess
ISignComponentProps) {
  const [walletState] = useState(WalletSigningState.UNKNOWN);
  // const desiredAddress = getAddress(senderAccount.address);

  const { getNetworkByChainId } = useNetworks();
  const detectedNetwork = getNetworkByChainId(rawTransaction.chainId);
  const networkName = detectedNetwork ? detectedNetwork.name : translateRaw('UNKNOWN_NETWORK');
  const walletConfig = getWalletConfig(WalletId.OFFLINE);

  const network = senderAccount.networkId;
  const contractName = useSelector(getContractName(network, rawTransaction.to));

  return (
    <SignTransactionOfflineUI
      walletConfig={walletConfig}
      walletState={walletState}
      networkName={networkName}
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      contractName={contractName}
    />
  );
}

const Footer = styled.div`
  width: 100%;
  margin-top: 2em;
`;

export interface UIProps {
  walletConfig: IWalletConfig;
  walletState: WalletSigningState;
  networkName: string;
  senderAccount: StoreAccount;
  rawTransaction: ITxObject;
  contractName?: string;
}

export const SignTransactionOfflineUI = ({
  walletConfig,
  rawTransaction,
  contractName
}: UIProps) => {
  const rawTransactionHex = useMemo(() => serialize(makeTransaction(rawTransaction)), [
    rawTransaction
  ]);

  return (
    <Box>
      <Heading fontSize="32px" textAlign="center" fontWeight="bold">
        {translate('SIGN_TX_TITLE', {
          $walletName: walletConfig.name || WALLETS_CONFIG.OFFLINE.name
        })}
      </Heading>
      <Body textAlign="center" lineHeight="1.5" fontSize={FONT_SIZE.MD} paddingTop={SPACING.LG}>
        {translate('SIGN_TX_OFFLINE_PROMPT', {
          $walletName: walletConfig.name || WALLETS_CONFIG.OFFLINE.name
        })}
      </Body>
      {isContractInteraction(rawTransaction.data) && rawTransaction.to && (
        <Box mt={3}>
          <TxIntermediaryDisplay address={rawTransaction.to} contractName={contractName} />
        </Box>
      )}

      <InputField
        label={translateRaw('RAW_TRANSACTION')}
        value={rawTransactionHex}
        textarea={true}
        height={'125px'}
        disabled={true}
      />

      <LinkApp href={ROUTE_PATHS.BROADCAST_TX.path}>
        <Button>Broadcast Transaction</Button>
      </LinkApp>

      <>
        <Body textAlign="center" lineHeight="1.5" fontSize={FONT_SIZE.MD} marginTop="16px">
          {translateRaw('SIGN_TX_EXPLANATION')}
        </Body>
        <Footer>
          <BusyBottom type={BusyBottomConfig.OFFLINE} />
        </Footer>
      </>
    </Box>
  );
};
