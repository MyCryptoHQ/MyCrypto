import { useState } from 'react';

import { DEFAULT_ETH, DerivationPath } from '@mycrypto/wallets';
import styled from 'styled-components';

import { Body, Box, BusyBottom, Button, Heading, InlineMessage, Spinner, Text } from '@components';
import Icon from '@components/Icon';
import { DEFAULT_GAP_TO_SCAN_FOR, DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN, HARDWARE_CONFIG } from '@config';
import { HDWallet } from '@features/AddAccount';
import {
  getAssetByUUID,
  getDPaths,
  getNetworkById,
  TDWActionError,
  useAssets,
  useHDWallet,
  useNetworks
} from '@services';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import {
  ExtendedAsset,
  FormData,
  IAccountAdditionData,
  InlineMessageType,
  Network,
  WalletId
} from '@types';
import { prop, uniqBy } from '@vendor';

const HardwareImage = styled(Icon)`
  vertical-align: center;
  margin: 2em;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin: 0.3em;
    padding: 0.5em;
  }
`;

const ErrorMessageContainer = styled.div`
  margin: 2em;
`;

const HardwareFooter = styled.div`
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-bottom: ${SPACING.BASE};
  }
`;

const HardwareConnectBtn = styled(Button)`
  margin-bottom: 2em;
  width: 420px;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 345px;
    margin-bottom: 0em;
  }
`;

export interface Props {
  formData: FormData;
  wallet: WalletId.LEDGER_NANO_S_NEW | WalletId.TREZOR_NEW | WalletId.GRIDPLUS;
  extraDPaths: DerivationPath[];
  onUnlock(param: IAccountAdditionData[]): void;
}

export const Hardware = ({ formData, onUnlock, wallet, extraDPaths }: Props) => {
  const { networks } = useNetworks();
  const { assets } = useAssets();
  const network = getNetworkById(formData.network, networks);
  const baseAsset = getAssetByUUID(assets)(network.baseAsset) as ExtendedAsset;
  const dpaths = uniqBy(prop('path'), [...getDPaths([network], wallet), ...extraDPaths]);
  const defaultDPath = network.dPaths[wallet] ?? DEFAULT_ETH;
  const [selectedDPath, setSelectedDPath] = useState(defaultDPath);
  const numOfAccountsToCheck = DEFAULT_NUM_OF_ACCOUNTS_TO_SCAN;
  const extendedDPaths = dpaths.map((dpath) => ({
    ...dpath,
    offset: 0,
    numOfAddresses: numOfAccountsToCheck
  }));

  const [assetToUse, setAssetToUse] = useState(baseAsset);
  const {
    isCompleted,
    isConnected,
    isConnecting,
    connectionError,
    selectedAsset,
    accountQueue,
    scannedAccounts,
    requestConnection,
    updateAsset,
    addDPaths,
    scanMoreAddresses,
    mergedDPaths
  } = useHDWallet(extendedDPaths, wallet, DEFAULT_GAP_TO_SCAN_FOR);

  const handleNullConnect = () => {
    requestConnection(network, assetToUse);
  };

  const handleAssetUpdate = (newAsset: ExtendedAsset) => {
    setAssetToUse(newAsset);
    updateAsset(newAsset);
  };

  if (isConnected && selectedAsset && (accountQueue ?? scannedAccounts)) {
    return (
      <HDWallet
        scannedAccounts={scannedAccounts}
        isCompleted={isCompleted}
        selectedAsset={selectedAsset}
        selectedDPath={selectedDPath}
        assets={assets}
        assetToUse={assetToUse}
        network={network}
        dpaths={mergedDPaths}
        setSelectedDPath={setSelectedDPath}
        updateAsset={updateAsset}
        addDPaths={addDPaths}
        scanMoreAddresses={scanMoreAddresses}
        handleAssetUpdate={handleAssetUpdate}
        onUnlock={onUnlock}
      />
    );
  }
  return (
    <HardwareWalletUI
      isConnecting={isConnecting}
      connectionError={connectionError}
      network={network}
      handleNullConnect={handleNullConnect}
      walletId={wallet}
    />
  );
};

export interface HardwareUIProps {
  network: Network;
  isConnecting: boolean;
  connectionError?: TDWActionError;
  walletId: WalletId.LEDGER_NANO_S_NEW | WalletId.TREZOR_NEW | WalletId.GRIDPLUS;

  handleNullConnect(): void;
}

export const HardwareWalletUI = ({
  network,
  connectionError,
  isConnecting,
  walletId,
  handleNullConnect
}: HardwareUIProps) => (
  <Box>
    <Heading fontSize="32px" textAlign="center" fontWeight="bold" mt="0">
      {translate('UNLOCK_WALLET')}{' '}
      {translateRaw('YOUR_WALLET_TYPE', {
        $walletType: translateRaw(HARDWARE_CONFIG[walletId].walletTypeTransKey)
      })}
    </Heading>
    <Box variant="columnCenter" minHeight="400px">
      <Text
        lineHeight="1.5"
        letterSpacing="normal"
        fontSize={FONT_SIZE.MD}
        paddingTop={SPACING.BASE}
        color={COLORS.GREY_DARKEST}
        textAlign="center"
      >
        {translate(HARDWARE_CONFIG[walletId].unlockTipTransKey, { $network: network.id })}
      </Text>
      <HardwareImage type={HARDWARE_CONFIG[walletId].iconId} />
      <Text
        lineHeight="1.5"
        letterSpacing="normal"
        fontSize={FONT_SIZE.MD}
        paddingTop={SPACING.BASE}
        color={COLORS.GREY_DARKEST}
        textAlign="center"
      >
        {connectionError && (
          <ErrorMessageContainer>
            <InlineMessage
              type={InlineMessageType.ERROR}
              value={`${translateRaw('GENERIC_HARDWARE_ERROR')} ${connectionError.message}`}
            />
          </ErrorMessageContainer>
        )}
        <br />
        {isConnecting ? (
          <>
            <Spinner /> {translate('WALLET_UNLOCKING')}
          </>
        ) : (
          <HardwareConnectBtn onClick={() => handleNullConnect()} disabled={isConnecting}>
            {translate(HARDWARE_CONFIG[walletId].scanTransKey)}
          </HardwareConnectBtn>
        )}
      </Text>
      {walletId === WalletId.LEDGER_NANO_S_NEW && (
        <Body textAlign="center" fontWeight="bold">
          {translateRaw('LEDGER_FIRMWARE_NOTICE')}
        </Body>
      )}
      <HardwareFooter>
        <BusyBottom type={HARDWARE_CONFIG[walletId].busyBottom} />
      </HardwareFooter>
    </Box>
  </Box>
);
