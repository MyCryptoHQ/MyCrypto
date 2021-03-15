import React from 'react';

import styled from 'styled-components';

import { Box, BusyBottom, Button, Heading, InlineMessage, Spinner, Text, TIcon } from '@components';
import Icon from '@components/Icon';
import { EXT_URLS } from '@config';
import { DeterministicWalletState } from '@services';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { BusyBottomConfig, InlineMessageType, Network, WalletId } from '@types';

interface HWConfig {
  walletTypeTransKey: string;

  unlockTipTransKey: string;

  scanTransKey: string;
  referralTransKey: string;
  referralURL: string;
  iconId: TIcon;
}

type THardwareConfigs = {
  [key in WalletId.LEDGER_NANO_S_NEW | WalletId.TREZOR_NEW]: HWConfig;
};

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

export interface HardwareUIProps {
  network: Network;
  state: DeterministicWalletState;
  walletId: WalletId.LEDGER_NANO_S_NEW | WalletId.TREZOR_NEW;

  handleNullConnect(): void;
}

const hardwareConfigs: THardwareConfigs = {
  [WalletId.LEDGER_NANO_S_NEW]: {
    walletTypeTransKey: 'X_LEDGER',
    scanTransKey: 'ADD_LEDGER_SCAN',
    referralTransKey: 'LEDGER_REFERRAL_2',
    referralURL: EXT_URLS.LEDGER_REFERRAL.url,
    unlockTipTransKey: 'LEDGER_TIP',
    iconId: 'ledger-icon-lg'
  },
  [WalletId.TREZOR_NEW]: {
    walletTypeTransKey: 'X_TREZOR',
    scanTransKey: 'ADD_TREZOR_SCAN',
    referralTransKey: 'ORDER_TREZOR',
    referralURL: EXT_URLS.TREZOR_REFERRAL.url,
    unlockTipTransKey: 'TREZOR_TIP',
    iconId: 'trezor-icon-lg'
  }
};

const HardwareWalletUI = ({ network, state, walletId, handleNullConnect }: HardwareUIProps) => (
  <Box p="2.5em">
    <Heading fontSize="32px" textAlign="center" fontWeight="bold">
      {translate('UNLOCK_WALLET')}{' '}
      {translateRaw('YOUR_WALLET_TYPE', {
        $walletType: translateRaw(hardwareConfigs[walletId].walletTypeTransKey)
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
        {translate(hardwareConfigs[walletId].unlockTipTransKey, { $network: network.id })}
        <HardwareImage type={hardwareConfigs[walletId].iconId} />
        {state.error && (
          <ErrorMessageContainer>
            <InlineMessage
              type={InlineMessageType.ERROR}
              value={`${translateRaw('GENERIC_HARDWARE_ERROR')} ${state.error.message}`}
            />
          </ErrorMessageContainer>
        )}
        {state.isConnecting ? (
          <>
            <Spinner /> {translate('WALLET_UNLOCKING')}
          </>
        ) : (
          <HardwareConnectBtn onClick={() => handleNullConnect()} disabled={state.isConnecting}>
            {translate(hardwareConfigs[walletId].scanTransKey)}
          </HardwareConnectBtn>
        )}
      </Text>
      <HardwareFooter>
        <BusyBottom
          type={
            walletId === WalletId.LEDGER_NANO_S_NEW
              ? BusyBottomConfig.LEDGER
              : BusyBottomConfig.TREZOR
          }
        />
      </HardwareFooter>
    </Box>
  </Box>
);

export default HardwareWalletUI;
