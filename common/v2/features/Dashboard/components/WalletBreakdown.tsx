import React, { useContext } from 'react';
import { Heading, Panel, Typography } from '@mycrypto/ui';

import { AccountContext, CurrentsContext } from 'v2/providers';
import { ExtendedAccount } from 'v2/services/Account/types';
import AccountDropdown from './AccountDropdown';
import './WalletBreakdown.scss';

// Legacy
import moreIcon from 'common/assets/images/icn-more.svg';
import {
  getCurrentsFromContext,
  getBalanceFromAccount,
  getBaseAssetFromAccount,
  getAccountBalances
} from 'v2/libs/accounts/accounts';
import { Link } from 'react-router-dom';

// Fake Data
/*const balances = [
  {
    asset: 'Ethereum',
    amount: '14.13 ETH',
    value: '$3,307.95'
  },
  {
    asset: 'OmiseGO',
    amount: '208.321234 OMG',
    value: '$646.80'
  },
  {
    asset: 'Aragon',
    amount: '200 ANT',
    value: '$159.63'
  },
  {
    asset: 'Other Tokens',
    amount: <Link to="/dashboard">View Details</Link>,
    value: '$140.03'
  }
];*/

function WalletBreakdown() {
  const { accounts, updateAccount } = useContext(AccountContext);
  const { currents, updateCurrentsAccounts } = useContext(CurrentsContext);
  const balances: any[] = [];

  const currentAccounts: ExtendedAccount[] = getCurrentsFromContext(accounts, currents.accounts);

  currentAccounts.map((en: ExtendedAccount) => {
    const baseAsset = getBaseAssetFromAccount(en);
    if (!balances.find(asset => asset.asset === (baseAsset ? baseAsset.name : 'Unknown Asset'))) {
      balances.push({
        asset: baseAsset ? baseAsset.name : 'Unknown Asset',
        amount:
          -(en.timestamp - Date.now()) >= 15000
            ? getAccountBalances(currentAccounts, updateAccount)
            : parseFloat(getBalanceFromAccount(en)).toFixed(4),
        value: 0
      });
    } else {
      const balanceToUpdate: any = balances.find(
        asset => asset.asset === (baseAsset ? baseAsset.name : 'Unknown Asset')
      );
      balanceToUpdate.amount = (
        parseFloat(balanceToUpdate.amount) + parseFloat(getBalanceFromAccount(en))
      ).toFixed(4);
    }
  });
  balances.push({
    asset: 'Other Tokens',
    amount: <Link to="/dashboard">View Details</Link>,
    value: '$0'
  });

  return (
    <div className="WalletBreakdown">
      <div className="WalletBreakdown-selectWrapper">
        <div className="WalletBreakdown-selectWrapper-select">
          <AccountDropdown
            accounts={accounts}
            selected={currents.accounts}
            onSubmit={(selected: string[]) => updateCurrentsAccounts(selected)}
          />
        </div>
      </div>
      <Panel className="WalletBreakdown-panel">
        <div>
          <Heading className="WalletBreakdown-panel-heading">
            Wallet Breakdown{' '}
            <span className="WalletBreakdown-panel-heading-extra">(All Accounts)</span>
          </Heading>
          <div className="WalletBreakdown-panel-figures">
            <div className="WalletBreakdown-panel-figures-figure">
              <Typography className="WalletBreakdown-panel-figures-figure-value">
                Ethereum
              </Typography>
              <Typography className="WalletBreakdown-panel-figures-figure-label">
                43% Of Your Funds
              </Typography>
            </div>
            <div className="WalletBreakdown-panel-figures-figure">
              <Typography className="WalletBreakdown-panel-figures-figure-value">
                $5,204.14
              </Typography>
              <Typography className="WalletBreakdown-panel-figures-figure-label">
                Value in US Dollars
              </Typography>
            </div>
          </div>
        </div>
        <div className="WalletBreakdown-panel-divider mobile-only" />
        <div>
          <div className="WalletBreakdown-panel-headingWrapper">
            <Heading className="WalletBreakdown-panel-heading">Balance</Heading>
            <img className="WalletBreakdown-panel-more" src={moreIcon} alt="More" />
          </div>
          <div className="WalletBreakdown-panel-balances">
            {balances.map(({ asset, amount, value }) => (
              <div key={asset} className="WalletBreakdown-panel-balances-balance">
                <div className="WalletBreakdown-panel-balances-balance-asset">
                  <Typography className="WalletBreakdown-panel-balances-balance-asset-name">
                    {asset}
                  </Typography>
                  <Typography className="WalletBreakdown-panel-balances-balance-asset-amount">
                    {amount}
                  </Typography>
                </div>
                <Typography className="WalletBreakdown-panel-balances-balance-amount">
                  {value}
                </Typography>
              </div>
            ))}
            <div className="WalletBreakdown-panel-divider" />
            <div className="WalletBreakdown-panel-balances-total">
              <Typography>Total</Typography>
              <Typography>$2,974.41</Typography>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

export default WalletBreakdown;
