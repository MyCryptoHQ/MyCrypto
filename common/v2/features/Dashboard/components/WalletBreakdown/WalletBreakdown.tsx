import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heading, Panel, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { AccountContext, SettingsContext } from 'v2/providers';
import { ExtendedAccount } from 'v2/services';
import AccountDropdown from './AccountDropdown';

// Legacy
import moreIcon from 'common/assets/images/icn-more.svg';
import { getCurrentsFromContext, getBalanceFromAccount, getBaseAssetFromAccount } from 'v2/libs';

const WalletBreakdownTop = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1080px) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
`;

const AccountDropdownWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  margin-bottom: 15px;
`;

const WalletBreakdownPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  padding: 15px;

  @media (min-width: 1080px) {
    flex-direction: row;
    margin-top: 0;
  }
`;

const BreakDownChart = styled.div`
  flex: 1;
`;

const BreakDownHeading = styled(Heading)`
  margin: 0;
  font-size: 20px !important;
  font-weight: bold;
  color: #424242;

  @media (min-width: 1080px) {
    font-size: 24px !important;
  }
`;

const BreakDownHeadingExtra = styled.span`
  display: inline;

  @media (min-width: 1080px) {
    display: none;
  }
`;

const PanelFigures = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 30px 0;
`;

const PanelFigure = styled.div``;

const PanelFigureValue = styled(Typography)`
  margin: 0;
  font-size: 18px;
  font-weight: bold;
`;

const PanelFigureLabel = styled(Typography)`
  margin: 0;
  font-size: 16px;
`;

interface PanelDividerProps {
  mobileOnly?: boolean;
}

const PanelDivider =
  styled.div <
  PanelDividerProps >
  `
  height: 1px;
  margin-bottom: 15px;
  background: #ddd;
  display: block;

  ${props =>
    props.mobileOnly &&
    `
  @media (min-width: 1080px) {
    display: none;
  }`};
`;

const VerticalPanelDivider = styled.div`
  width: 1px;
  margin: 0 15px;
  background: #ddd;
  display: none;

  @media (min-width: 1080px) {
    display: block;
  }
`;

const BreakDownBalances = styled.div`
  flex: 1;
`;

const BreakDownHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BreakDownMore = styled.img`
  display: block;
`;

const BreakDownBalanceList = styled.div`
  display: flex;
  flex-direction: column;
  color: #282d32;
  font-size: 16px;
`;

const BreakDownBalance = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 11px 0;

  &:first-of-type {
    margin-top: 16px;
  }
`;

const BreakDownBalanceAsset = styled.div``;

const BreakDownBalanceAssetName = styled(Typography)`
  margin: 0;
`;

const BreakDownBalanceAssetAmount = styled(BreakDownBalanceAssetName)`
  a {
    color: #1eb8e7;
  }
`;

const BreakDownBalanceTotal = styled.div`
  display: flex;
  justify-content: space-between;
`;

function WalletBreakdown() {
  const { accounts } = useContext(AccountContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const balances: any[] = [];
  const currentAccounts: ExtendedAccount[] = getCurrentsFromContext(
    accounts,
    settings.dashboardAccounts
  );

  currentAccounts.forEach((account: ExtendedAccount) => {
    const baseAsset = getBaseAssetFromAccount(account);
    if (!balances.find(asset => asset.asset === (baseAsset ? baseAsset.name : 'Unknown Asset'))) {
      balances.push({
        asset: baseAsset ? baseAsset.name : 'Unknown Asset',
        amount: parseFloat(getBalanceFromAccount(account)).toFixed(4),
        value: 0
      });
    } else {
      const balanceToUpdate: any = balances.find(
        asset => asset.asset === (baseAsset ? baseAsset.name : 'Unknown Asset')
      );
      balanceToUpdate.amount = (
        parseFloat(balanceToUpdate.amount) + parseFloat(getBalanceFromAccount(account))
      ).toFixed(4);
    }
    balances.push({
      asset: 'Other Tokens',
      amount: <Link to="/dashboard">View Details</Link>,
      value: '$0'
    });
  });

  return (
    <>
      <WalletBreakdownTop>
        <AccountDropdownWrapper>
          <AccountDropdown
            accounts={accounts}
            selected={settings.dashboardAccounts}
            onSubmit={(selected: string[]) => updateSettingsAccounts(selected)}
          />
        </AccountDropdownWrapper>
      </WalletBreakdownTop>
      <WalletBreakdownPanel>
        <BreakDownChart>
          <BreakDownHeading>
            Wallet Breakdown <BreakDownHeadingExtra>(All Accounts)</BreakDownHeadingExtra>
          </BreakDownHeading>
          <PanelFigures>
            <PanelFigure>
              <PanelFigureValue>Ethereum</PanelFigureValue>
              <PanelFigureLabel>43% Of Your Funds</PanelFigureLabel>
            </PanelFigure>
            <PanelFigure>
              <PanelFigureValue>$5,204.14</PanelFigureValue>
              <PanelFigureLabel>Value in US Dollars</PanelFigureLabel>
            </PanelFigure>
          </PanelFigures>
        </BreakDownChart>
        <PanelDivider mobileOnly={true} />
        <VerticalPanelDivider />
        <BreakDownBalances>
          <BreakDownHeadingWrapper>
            <BreakDownHeading>Balance</BreakDownHeading>
            <BreakDownMore src={moreIcon} alt="More" />
          </BreakDownHeadingWrapper>
          <BreakDownBalanceList>
            {balances.map(({ asset, amount, value }) => (
              <BreakDownBalance key={asset}>
                <BreakDownBalanceAsset>
                  <BreakDownBalanceAssetName>{asset}</BreakDownBalanceAssetName>
                  <BreakDownBalanceAssetAmount>{amount}</BreakDownBalanceAssetAmount>
                </BreakDownBalanceAsset>
                <BreakDownBalanceAssetAmount>{value}</BreakDownBalanceAssetAmount>
              </BreakDownBalance>
            ))}
            <PanelDivider />
            <BreakDownBalanceTotal>
              <Typography>Total</Typography>
              <Typography>$2,974.41</Typography>
            </BreakDownBalanceTotal>
          </BreakDownBalanceList>
        </BreakDownBalances>
      </WalletBreakdownPanel>
    </>
  );
}

export default WalletBreakdown;
