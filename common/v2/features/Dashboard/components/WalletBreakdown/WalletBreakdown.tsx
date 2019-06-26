import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heading, Panel, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { AccountContext, SettingsContext } from 'v2/providers';
import { ExtendedAccount } from 'v2/services';
import AccountDropdown from './AccountDropdown';
import BalancesList from './BalancesList';
import { getCurrentsFromContext, getBalanceFromAccount, getBaseAssetFromAccount } from 'v2/libs';
import BreakdownChart from './BreakdownChart';

import moreIcon from 'common/assets/images/icn-more.svg';

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
  padding: 0;

  @media (min-width: 1080px) {
    flex-direction: row;
    margin-top: 0;
  }
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

const NoAssetsBreakdownHeading = styled(BreakDownHeading)`
  position: absolute;
  top: 15px;
  left: 15px;
`;

const NoAssetsWrapper = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const PlusIcon = styled.img`
  width: 75px;
  height: 75px;
`;

const NoAssetsHeading = styled(Heading)`
  font-size: 24px !important;
  font-weight: bold;
  color: #b5bfc7;
`;

const NoAssetsDescription = styled(Typography)`
  color: #b5bfc7;
  text-align: center;
`;

const BreakDownChart = styled.div`
  flex: 1;
  padding-left: 15px;
  padding-top: 15px;
  padding-bottom: 15px;

  @media (max-width: 1080px) {
    padding-right: 15px;
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
  padding-right: 15px;
  padding-top: 15px;
  padding-bottom: 15px;

  @media (max-width: 1080px) {
    padding-left: 15px;
  }
`;

const BreakDownHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BreakDownMore = styled.img`
  display: block;
  cursor: pointer;
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

const BalancesOnly = styled.div`
  width: 100%;

  > section {
    padding: 0;
    margin: 0;
  }
`;

function WalletBreakdown() {
  const [showChart, setShowChart] = useState(true);
  const { accounts } = useContext(AccountContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const balances: any[] = [];
  const currentAccounts: ExtendedAccount[] = getCurrentsFromContext(
    accounts,
    settings.dashboardAccounts
  );

  currentAccounts.forEach((account: ExtendedAccount) => {
    const baseAsset = getBaseAssetFromAccount(account);
    const assetName = baseAsset ? baseAsset.name : 'Unknown Asset';
    const assetAmount = parseFloat(getBalanceFromAccount(account));
    const assetInBalances = balances.find(asset => asset.asset === assetName);
    if (!assetInBalances) {
      balances.push({
        asset: assetName,
        amount: assetAmount.toFixed(4),
        value: 0,
        ticker: baseAsset ? baseAsset.ticker : ''
      });
    } else {
      assetInBalances.amount = (parseFloat(assetInBalances.amount) + assetAmount).toFixed(4);
    }
    balances.push({
      asset: 'Other Tokens',
      amount: <Link to="/dashboard">View Details</Link>,
      value: '$0'
    });
  });

  const toggleShowChart = () => {
    setShowChart(!showChart);
  };

  const getNoAssets = () => {
    return (
      <NoAssetsWrapper>
        <NoAssetsBreakdownHeading>
          Wallet Breakdown <BreakDownHeadingExtra>(All Accounts)</BreakDownHeadingExtra>
        </NoAssetsBreakdownHeading>
        <PlusIcon src={moreIcon} />
        <NoAssetsHeading>No Assets Found</NoAssetsHeading>
        <NoAssetsDescription>
          You can{' '}
          <a href="https://buy.mycrypto.com/" target="_blank" rel="noreferrer">
            buy some ETH
          </a>{' '}
          with your credit card to get started!
        </NoAssetsDescription>
      </NoAssetsWrapper>
    );
  };

  const getChartWithBalances = () => {
    return (
      <>
        <BreakDownChart>
          <BreakDownHeading>
            Wallet Breakdown <BreakDownHeadingExtra>(All Accounts)</BreakDownHeadingExtra>
          </BreakDownHeading>
          <BreakdownChart />
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
            <BreakDownMore src={moreIcon} alt="More" onClick={toggleShowChart} />
          </BreakDownHeadingWrapper>
          <BreakDownBalanceList>
            {balances.map(({ asset, amount, value, ticker }) => (
              <BreakDownBalance key={asset}>
                <BreakDownBalanceAsset>
                  <BreakDownBalanceAssetName>{asset}</BreakDownBalanceAssetName>
                  <BreakDownBalanceAssetAmount>
                    {amount} {ticker}
                  </BreakDownBalanceAssetAmount>
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
      </>
    );
  };

  const getBalancesOnly = () => {
    return (
      <BalancesOnly>
        <BalancesList balances={balances} toggleShowChart={toggleShowChart} />
      </BalancesOnly>
    );
  };

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
        {balances.length === 0
          ? getNoAssets()
          : showChart ? getChartWithBalances() : getBalancesOnly()}
      </WalletBreakdownPanel>
    </>
  );
}

export default WalletBreakdown;
