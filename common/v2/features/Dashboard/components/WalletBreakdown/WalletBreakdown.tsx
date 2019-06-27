import React, { useContext, useState } from 'react';
import { Heading, Panel, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { AccountContext, SettingsContext } from 'v2/providers';
import { Asset } from 'v2/services/Asset/types';
import { ExtendedAccount } from 'v2/services';
import AccountDropdown from './AccountDropdown';
import BalancesList from './BalancesList';
import {
  getCurrentsFromContext,
  getBalanceFromAccount,
  getBaseAssetFromAccount,
  getAssetByUUID,
  getTokenBalanceFromAccount
} from 'v2/libs';
import { Balance } from './types';

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

const BreakDownChartWrapper = styled.div`
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

const PanelFigureValue = styled.div`
  margin: 0;
  font-size: 22px;
  font-weight: bold;
`;

const PanelFigureLabel = styled.div`
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
  font-weight: normal;
`;

const BreakDownBalance = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 11px 0;
  line-height: 1.2;

  &:first-of-type {
    margin-top: 16px;
  }
`;

const BreakDownBalanceAssetName = styled.div`
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
  font-size: 16px;
  font-weight: normal;
`;

const BalancesOnly = styled.div`
  width: 100%;

  > section {
    padding: 0;
    margin: 0;
  }
`;

const numberOfAssetsDisplayed = 4;

function WalletBreakdown() {
  const [showChart, setShowChart] = useState(true);
  const { accounts } = useContext(AccountContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);

  const balances: Balance[] = [];
  const currentAccounts: ExtendedAccount[] = getCurrentsFromContext(
    accounts,
    settings.dashboardAccounts
  );

  // Adds/updates an asset in array of balances, which are later displayed in the chart, balance list and in the secondary view
  const addAssetToBalances = (
    asset: Asset | undefined,
    assetAmount: number,
    assetValue: number
  ) => {
    const assetName = asset ? asset.name : 'Unknown Asset';
    const assetTicker = asset ? asset.ticker : '';

    const existingAssetInBalances = balances.find(balance => balance.name === assetName);

    if (!existingAssetInBalances) {
      balances.push({
        name: assetName,
        amount: assetAmount,
        fiatValue: assetAmount * assetValue,
        ticker: assetTicker
      });
    } else {
      existingAssetInBalances.amount = existingAssetInBalances.amount + assetAmount;
      existingAssetInBalances.fiatValue = existingAssetInBalances.amount * assetValue;
    }
  };

  // Combine all base assets and account assets in the balances array
  currentAccounts.forEach((account: ExtendedAccount) => {
    const baseAsset = getBaseAssetFromAccount(account);
    const baseAssetAmount = parseFloat(getBalanceFromAccount(account));
    const baseAssetValue = 333.33; //TODO: Get actual asset value from the local cache

    addAssetToBalances(baseAsset, baseAssetAmount, baseAssetValue);

    account.assets.forEach(accountAsset => {
      const asset = getAssetByUUID(accountAsset.uuid);
      const assetAmount = parseFloat(getTokenBalanceFromAccount(account, asset));
      const assetValue = 333.33; //TODO: Get actual asset value from the local cache
      addAssetToBalances(asset, assetAmount, assetValue);
    });
  });

  balances.sort((a, b) => {
    return b.fiatValue - a.fiatValue;
  });

  const totalFiatValue = balances.reduce((sum, asset) => {
    return (sum += asset.fiatValue);
  }, 0);

  const highestPercentageAssetName = balances.length > 0 && balances[0].name;
  const highestPercentage =
    balances.length > 0 && Math.floor(balances[0].fiatValue / totalFiatValue * 100);

  /* Construct a finalBalances array which consits of top X assets and a otherTokensAsset 
     which combines the fiat value of all remaining tokens that are in the balances array*/
  let finalBalances = balances;
  if (balances.length > numberOfAssetsDisplayed) {
    const otherBalances = balances.slice(numberOfAssetsDisplayed, balances.length);

    const otherTokensAsset = {
      name: 'Other Tokens',
      ticker: 'Other',
      isOther: true,
      amount: 0,
      fiatValue: otherBalances.reduce((sum, asset) => {
        return (sum += asset.fiatValue);
      }, 0)
    };

    finalBalances = balances.slice(0, numberOfAssetsDisplayed);
    finalBalances.push(otherTokensAsset);
  }

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
        <BreakDownChartWrapper>
          <BreakDownHeading>
            Wallet Breakdown <BreakDownHeadingExtra>(All Accounts)</BreakDownHeadingExtra>
          </BreakDownHeading>
          <PanelFigures>
            <PanelFigure>
              <PanelFigureValue>{highestPercentageAssetName}</PanelFigureValue>
              <PanelFigureLabel>{highestPercentage}% Of Your Funds</PanelFigureLabel>
            </PanelFigure>
            <PanelFigure>
              <PanelFigureValue>
                ${balances.length > 0 && balances[0].fiatValue.toFixed(2)}
              </PanelFigureValue>
              <PanelFigureLabel>Value in US Dollars</PanelFigureLabel>
            </PanelFigure>
          </PanelFigures>
        </BreakDownChartWrapper>
        <PanelDivider mobileOnly={true} />
        <VerticalPanelDivider />
        <BreakDownBalances>
          <BreakDownHeadingWrapper>
            <BreakDownHeading>Balance</BreakDownHeading>
            <BreakDownMore src={moreIcon} alt="More" onClick={toggleShowChart} />
          </BreakDownHeadingWrapper>
          <BreakDownBalanceList>
            {finalBalances.map(({ name, amount, fiatValue, ticker, isOther }) => (
              <BreakDownBalance key={name}>
                <div>
                  <BreakDownBalanceAssetName>{name}</BreakDownBalanceAssetName>
                  <BreakDownBalanceAssetAmount>
                    {!isOther ? (
                      `${amount.toFixed(4)} ${ticker}`
                    ) : (
                      <a onClick={toggleShowChart}>View Details</a>
                    )}
                  </BreakDownBalanceAssetAmount>
                </div>
                <BreakDownBalanceAssetAmount>${fiatValue.toFixed(2)}</BreakDownBalanceAssetAmount>
              </BreakDownBalance>
            ))}
            <PanelDivider />
            <BreakDownBalanceTotal>
              <div>Total</div>
              <div>${totalFiatValue.toFixed(2)}</div>
            </BreakDownBalanceTotal>
          </BreakDownBalanceList>
        </BreakDownBalances>
      </>
    );
  };

  const getBalancesOnly = () => {
    return (
      <BalancesOnly>
        <BalancesList
          balances={balances}
          toggleShowChart={toggleShowChart}
          totalFiatValue={totalFiatValue}
        />
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
