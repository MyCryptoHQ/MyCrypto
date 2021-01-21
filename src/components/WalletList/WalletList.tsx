import React from 'react';

import { AnyAction, bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@components/Button';
import { DEMO_SETTINGS, getWalletConfig, ROUTE_PATHS } from '@config';
import { AppState, getAccounts, getIsDemoMode, importState } from '@store';
import { BREAK_POINTS, COLORS } from '@theme';
import translate, { translateRaw } from '@translations';
import { IStory, WalletId } from '@types';
import { getWeb3Config } from '@utils';

import { WalletButton } from './WalletButton';

const { SCREEN_XS } = BREAK_POINTS;
const { BLUE_BRIGHT } = COLORS;

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
  color: ${(props) => props.theme.headline};
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.5;
  font-weight: normal;
  color: ${(props) => props.theme.text};
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
  font-size: 16px;
  text-align: center;
  color: #093053;
  white-space: pre-line;
  width: 100%;
  flex-direction: column;
  margin-bottom: 15px;
  display: ${(props) => (props.showInOneLine ? 'block' : 'grid')};

  @media screen and (max-width: ${SCREEN_XS}) {
    display: grid;
  }

  a {
    color: ${BLUE_BRIGHT};
  }
`;

const SDemoButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

interface WalletListProps {
  wallets: IStory[];
  showHeader?: boolean;
  onSelect(name: WalletId): void;
  calculateMargin?(index: number): string;
}

const WalletList = ({
  wallets,
  onSelect,
  showHeader,
  calculateMargin,
  isDemoMode,
  accounts,
  importState
}: Props) => {
  return (
    <div>
      {showHeader && (
        <>
          <Heading>{translate('DECRYPT_ACCESS')}</Heading>
          <Description>{translate('ADD_ACCOUNT_DESCRIPTION')}</Description>
        </>
      )}
      <WalletsContainer>
        {wallets
          .filter((w) => !w.hideFromWalletList)
          .map((wallet: IStory, index: number) => {
            const walletInfo =
              wallet.name === WalletId.WEB3 ? getWeb3Config() : getWalletConfig(wallet.name);
            return (
              <WalletButton
                key={`wallet-icon-${wallet.name}`}
                name={translateRaw(walletInfo.lid)}
                icon={walletInfo.icon}
                description={translateRaw(walletInfo.description)}
                margin={calculateMargin && calculateMargin(index)}
                onClick={() => onSelect(wallet.name)}
                isDisabled={wallet.isDisabled}
              />
            );
          })}
      </WalletsContainer>
      <InfoWrapper>
        <Info showInOneLine={true}>
          {translateRaw('ADD_ACCOUNT_FOOTER_LABEL')}{' '}
          <Link to={ROUTE_PATHS.CREATE_WALLET.path}>{translateRaw('ADD_ACCOUNT_FOOTER_LINK')}</Link>
        </Info>
        <Info>
          {translateRaw('DOWNLOAD_APP_FOOTER_LABEL')}
          <Link to={ROUTE_PATHS.DOWNLOAD_DESKTOP_APP.path}>
            {translateRaw('DOWNLOAD_APP_FOOTER_LINK')}
          </Link>
        </Info>
        <Info showInOneLine={true}>
          {translateRaw('ADD_ACCOUNT_IMPORT_SETTINGS_LABEL')}{' '}
          <Link to={ROUTE_PATHS.SETTINGS_IMPORT.path}>
            {translateRaw('ADD_ACCOUNT_IMPORT_SETTINGS_LINK')}
          </Link>
        </Info>
        {accounts.length === 0 && (
          <SDemoButtonContainer>
            <Link to={ROUTE_PATHS.DASHBOARD.path}>
              <Button
                colorScheme={'warning'}
                disabled={isDemoMode}
                onClick={() => importState(JSON.stringify(DEMO_SETTINGS))}
              >
                {translateRaw('DEMO_BUTTON_TEXT')}
              </Button>
            </Link>
          </SDemoButtonContainer>
        )}
      </InfoWrapper>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  isDemoMode: getIsDemoMode(state),
  accounts: getAccounts(state)
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      importState: importState
    },
    dispatch
  );
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & WalletListProps;

export default connector(WalletList);
