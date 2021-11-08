import styled from 'styled-components';

import { Body, Box, BusyBottom, Button, Heading, InlineMessage, Spinner, Text } from '@components';
import Icon from '@components/Icon';
import { HARDWARE_CONFIG } from '@config';
import { TDWActionError } from '@services';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { InlineMessageType, Network, WalletId } from '@types';

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
  isConnecting: boolean;
  connectionError?: TDWActionError;
  walletId: WalletId.LEDGER_NANO_S_NEW | WalletId.TREZOR_NEW | WalletId.GRIDPLUS;

  handleNullConnect(): void;
}

const HardwareWalletUI = ({
  network,
  connectionError,
  isConnecting,
  walletId,
  handleNullConnect
}: HardwareUIProps) => (
  <Box p="2.5em">
    <Heading fontSize="32px" textAlign="center" fontWeight="bold">
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

export default HardwareWalletUI;
