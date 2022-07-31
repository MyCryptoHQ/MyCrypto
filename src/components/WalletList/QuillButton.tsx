import React from 'react';

import styled, { keyframes } from 'styled-components';

import keystore from '@assets/images/icn-keystore.svg';
import privateKey from '@assets/images/icn-privatekey.svg';
import securityBadge from '@assets/images/icn-securitybadge.svg';
import srp from '@assets/images/icn-srp.svg';
import { Body, Box } from '@components';
import { WALLETS_CONFIG } from '@config';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { WalletId } from '@types';

const { SCREEN_SM } = BREAK_POINTS;
const { WHITE } = COLORS;

interface OwnProps {
  margin?: string;
  onClick(walletType: any): void;
}

type Props = OwnProps;

const WalletButtonEnterAnimation = (isDisabled?: boolean) => keyframes`
  0% {
    opacity: 0;
    transform: translateY(6px);
  }
  100% {
    ${isDisabled ? 'opacity: 0.6;' : 'opacity: 1;'}
    transform: translateY(0px);
  }
`;

const WalletButtonWrapper = styled.div<{ margin?: string; isDisabled?: boolean }>`
  display: flex;
  flex-basis: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px ${(props) => props.margin};
  height: 200px;
  width: 400px;
  padding: 25px 15px;
  background-color: ${WHITE};
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease;
  animation: ${({ isDisabled }) => WalletButtonEnterAnimation(isDisabled)} 400ms ease;
  ${({ isDisabled }) => isDisabled && 'opacity: 0.6;'};

  :hover {
    ${({ isDisabled }) => (isDisabled ? 'opacity: 0.6;' : 'opacity: 0.8;')}
  }
`;

const WalletLabel = styled.div`
  transition: color 150ms ease;
  font-size: 18px;
  padding-top: 16px;
  padding-bottom: 16px;
`;

const WalletIcon = styled.img`
  max-height: 75px;
  width: auto;

  @media screen and (max-width: ${SCREEN_SM}) {
    max-height: 60px;
  }
`;

const Image = styled.img`
  height: 25px;
  margin-right: ${SPACING.SM};
  vertical-align: middle;
`;

const WALLET_TYPES = [
  {
    label: translateRaw('KEYSTORE'),
    icon: keystore
  },
  {
    label: translateRaw('PRIVATE_KEY'),
    icon: privateKey
  },
  {
    label: translateRaw('SECRET_RECOVERY_PHRASE'),
    icon: srp
  }
];

export const QuillButton = (props: Props) => {
  const { margin, onClick } = props;

  const handleClick = () => onClick(WalletId.QUILL);

  return (
    <WalletButtonWrapper onClick={handleClick} margin={margin}>
      <Box width="100%" display="flex">
        <Box flex="1">
          <Box display="flex" alignItems="center">
            <Box p="1" bg="rgba(123, 190, 52, 0.1)" borderRadius="2px">
              <Body as="span" fontSize="12px" fontWeight="bold" color={COLORS.GREEN_ACCENT}>
                {translateRaw('NEW')}!
              </Body>
            </Box>
          </Box>
        </Box>
        <Box flex="1">
          <WalletIcon src={WALLETS_CONFIG.QUILL.icon} alt={WALLETS_CONFIG.QUILL.name + ' logo'} />
        </Box>
        <Box flex="1">
          <Box display="flex" alignItems="center" justifyContent="end">
            <Image src={securityBadge} />
            <Body
              as="span"
              color={COLORS.LIGHT_PURPLE}
              fontSize="12px"
              fontWeight="bold"
              textTransform="uppercase"
            >
              {translateRaw('INCREASED_SECURITY')}
            </Body>
          </Box>
        </Box>
      </Box>
      <WalletLabel>{WALLETS_CONFIG.QUILL.name}</WalletLabel>

      <Box display="flex">
        {WALLET_TYPES.map(({ label, icon }, idx) => (
          <Box
            key={label}
            bg={COLORS.GREY_ATHENS}
            p="4px 16px"
            borderRadius="8px"
            mr={idx < WALLET_TYPES.length - 1 ? '1' : '0'}
          >
            <Image src={icon} />
            <Body as="span" color={COLORS.BLUE_DARK_SLATE} fontSize="12px">
              {label}
            </Body>
          </Box>
        ))}
      </Box>
    </WalletButtonWrapper>
  );
};
