import styled, { keyframes } from 'styled-components';

import { WALLETS_CONFIG } from '@config';
import { BREAK_POINTS, COLORS } from '@theme';
import { WalletId } from '@types';

const { SCREEN_SM, SCREEN_XS } = BREAK_POINTS;
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

  @media only screen and (max-width: ${SCREEN_XS}) {
    height: 150px;
    width: 150px;
  }
`;

const WalletLabel = styled.div`
  transition: color 150ms ease;
  font-size: 18px;
  padding-top: 19px;
`;

const WalletIcon = styled.img`
  max-height: 75px;
  width: auto;

  @media screen and (max-width: ${SCREEN_SM}) {
    max-height: 60px;
  }
`;

export const QuillButton = (props: Props) => {
  const { margin, onClick } = props;

  const handleClick = () => onClick(WalletId.QUILL);

  return (
    <WalletButtonWrapper onClick={handleClick} margin={margin}>
      <WalletIcon src={WALLETS_CONFIG.QUILL.icon} alt={WALLETS_CONFIG.QUILL.name + ' logo'} />
      <WalletLabel>{WALLETS_CONFIG.QUILL.name}</WalletLabel>
    </WalletButtonWrapper>
  );
};
