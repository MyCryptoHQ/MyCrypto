import { useEffect } from 'react';

import { AnyAction, bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { Box, BusyBottom, Button } from '@components';
import { DEMO_SETTINGS, getWalletConfig, ROUTE_PATHS } from '@config';
import {
  AppState,
  getAccounts,
  importComplete,
  importRequest,
  importState,
  importSuccess
} from '@store';
import { SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { BusyBottomConfig, IStory, WalletId } from '@types';
import { getWeb3Config } from '@utils';

import { WalletButton } from './WalletButton';

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

interface WalletListProps {
  wallets: IStory[];
  showHeader?: boolean;
  onSelect(name: WalletId): void;
}

const WalletList = ({
  wallets,
  onSelect,
  showHeader,
  accounts,
  importRequest,
  importSuccess,
  importState,
  importComplete,
  history
}: Props) => {
  useEffect(() => {
    if (importSuccess) {
      importComplete();
      history.push(ROUTE_PATHS.DASHBOARD.path);
    }
  }, [importSuccess, accounts]);

  const calculateMargin = (index: number) => (index < 4 ? '2%' : '10px');

  return (
    <div>
      {showHeader && (
        <>
          <Heading>{translate('DECRYPT_ACCESS')}</Heading>
          <Description>{translate('ADD_ACCOUNT_DESCRIPTION')}</Description>
        </>
      )}
      {accounts.length === 0 && (
        <Box variant="rowCenter" mt={SPACING.BASE} mb={SPACING.BASE}>
          <Button
            colorScheme={'warning'}
            onClick={() => importState(JSON.stringify(DEMO_SETTINGS))}
            loading={importRequest}
          >
            {translateRaw('DEMO_BUTTON_TEXT')}
          </Button>
        </Box>
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
                margin={calculateMargin(index)}
                onClick={() => onSelect(wallet.name)}
                isDisabled={wallet.isDisabled}
              />
            );
          })}
      </WalletsContainer>
      <BusyBottom type={BusyBottomConfig.GENERAL} />
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  accounts: getAccounts(state),
  importRequest: importRequest(state),
  importSuccess: importSuccess(state)
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      importState,
      importComplete
    },
    dispatch
  );
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & WalletListProps & RouteComponentProps;

export default withRouter(connector(WalletList));
