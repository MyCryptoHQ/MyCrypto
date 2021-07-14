import { Tooltip } from '@mycrypto/ui';
import styled, { keyframes } from 'styled-components';

import { BREAK_POINTS, COLORS } from '@theme';
import translate from '@translations';
import { WalletId } from '@types';

const { SCREEN_SM, SCREEN_XS } = BREAK_POINTS;
const { WHITE } = COLORS;

interface OwnProps {
  name: string;
  description?: string;
  example?: string;
  walletType?: WalletId;
  isSecure?: boolean;
  isDisabled?: boolean;
  disableReason?: string;
  margin?: string;
  onClick(walletType: any): void;
}

interface Icon {
  icon?: string;
  tooltip?: string;
  href?: string;
  arialabel?: string;
}

type Props = OwnProps & Icon;

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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px ${(props) => props.margin};
  height: 200px;
  width: 200px;
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

export const WalletButton = (props: Props) => {
  const { name, icon, margin, isDisabled, walletType, onClick } = props;

  const handleClick = () => !isDisabled && onClick(walletType);

  const WalletButtonBody = () => (
    <WalletButtonWrapper onClick={handleClick} margin={margin} isDisabled={isDisabled}>
      {icon && <WalletIcon src={icon} alt={name + ' logo'} />}
      <WalletLabel>{name}</WalletLabel>
    </WalletButtonWrapper>
  );

  return isDisabled ? (
    <Tooltip tooltip={translate('WALLET_DISABLED')}>
      <WalletButtonBody />
    </Tooltip>
  ) : (
    <WalletButtonBody />
  );
};
