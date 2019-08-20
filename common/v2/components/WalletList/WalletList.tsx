import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import translate, { translateRaw } from 'translations';
import { WalletButton } from './WalletButton';
import { WalletName, IStory } from 'v2/types';
import { WALLET_INFO, ROUTE_PATHS } from 'v2/config';
import { BREAK_POINTS, COLORS } from 'v2/theme';
import { IS_ELECTRON } from 'v2/utils';

const { SCREEN_XS } = BREAK_POINTS;
const { BRIGHT_SKY_BLUE } = COLORS;

const Heading = styled.p`
  font-size: 34px;
  width: 100%;
  display: flex;
  justify-content: center;
  font-weight: bold;
  line-height: normal;
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
  color: ${props => props.theme.headline};
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.5;
  font-weight: normal;
  color: ${props => props.theme.text};
  white-space: pre-line;
  display: flex;
  justify-content: center;
  text-align: center;
`;

const WalletsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const InfoWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  width: 100%;

  @media screen and (max-width: ${SCREEN_XS}) {
    padding: 0 15px;
  }
`;

interface InfoProps {
  showInOneLine?: boolean;
}

const Info = styled.div<InfoProps>`
  justify-content: center;
  font-family: Lato;
  font-size: 16px;
  text-align: center;
  color: #093053;
  white-space: pre-line;
  width: 100%;
  flex-direction: column;
  margin-bottom: 15px;
  display: ${props => (props.showInOneLine ? 'block' : 'grid')};

  @media screen and (max-width: ${SCREEN_XS}) {
    display: grid;
  }

  a {
    color: ${BRIGHT_SKY_BLUE};
  }
`;

interface Props {
  wallets: any[];
  showHeader?: boolean;
  onSelect(name: WalletName): void;
}

export default class WalletList extends PureComponent<Props> {
  public render() {
    const { wallets, onSelect, showHeader } = this.props;
    const validWallets = wallets.filter(w => !w.hideFromWalletList); // @TODO Filter here according to electronOnly
    return (
      <div>
        {showHeader && (
          <>
            <Heading>{translate('DECRYPT_ACCESS')}</Heading>
            <Description>{translate('ADD_ACCOUNT_DESCRIPTION')}</Description>
          </>
        )}
        <WalletsContainer>
          {validWallets.map((wallet: IStory) => {
            const walletInfo = WALLET_INFO[wallet.name];
            return (
              <WalletButton
                key={`wallet-icon-${wallet.name}`}
                name={translateRaw(walletInfo.lid)}
                icon={walletInfo.icon}
                description={translateRaw(walletInfo.description)}
                onClick={() => onSelect(wallet.name)}
              />
            );
          })}
        </WalletsContainer>
        <InfoWrapper>
          <Info showInOneLine={true}>
            {translateRaw('ADD_ACCOUNT_FOOTER_LABEL')}{' '}
            <Link to={ROUTE_PATHS.CREATE_WALLET.path}>
              {translateRaw('ADD_ACCOUNT_FOOTER_LINK')}
            </Link>
          </Info>
          {!IS_ELECTRON && (
            <Info>
              {translateRaw('DOWNLOAD_APP_FOOTER_LABEL')}{' '}
              <Link to={ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path}>
                {translateRaw('DOWNLOAD_APP_FOOTER_LINK')}
              </Link>
            </Info>
          )}
        </InfoWrapper>
      </div>
    );
  }
}
