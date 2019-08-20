import React from 'react';
import styled from 'styled-components';

import { WalletName } from 'config';
import { BREAK_POINTS, COLORS } from 'v2/theme';

const { SCREEN_SM } = BREAK_POINTS;
const { WHITE } = COLORS;

interface OwnProps {
  name: string;
  description?: string;
  example?: string;
  walletType?: WalletName;
  isSecure?: boolean;
  isDisabled?: boolean;
  disableReason?: string;
  onClick(walletType: any): void;
}

interface StateProps {
  isFormatDisabled?: boolean;
}

interface Icon {
  icon?: string;
  tooltip?: string;
  href?: string;
  arialabel?: string;
}

type Props = OwnProps & StateProps & Icon;

const WalletButtonWrapper = styled.div`
  @keyframes wallet-button-enter {
    0% {
      opacity: 0;
      transform: translateY(6px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px;
  height: 200px;
  width: 200px;
  padding: 25px 15px;
  background-color: ${WHITE};
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease;
  animation: wallet-button-enter 400ms ease 1;

  :hover {
    opacity: 0.8;
  }

  @media only screen and (max-width: ${SCREEN_SM}) {
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
  opacity: 0.8;

  @media screen and (max-width: ${SCREEN_SM}) {
    max-height: 60px;
  }
`;

export class WalletButton extends React.PureComponent<Props> {
  public render() {
    const { name, icon } = this.props;

    return (
      <WalletButtonWrapper onClick={this.handleClick}>
        {icon && <WalletIcon src={icon} alt={name + ' logo'} />}
        <WalletLabel>{name}</WalletLabel>
      </WalletButtonWrapper>
    );
  }

  private handleClick = () => {
    this.props.onClick(this.props.walletType);
  };
}
