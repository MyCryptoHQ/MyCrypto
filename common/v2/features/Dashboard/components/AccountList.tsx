import { Address, Button, CollapsibleTable, Icon, Network, Typography } from '@mycrypto/ui';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { truncate } from 'v2/libs';
import { ExtendedAccount } from 'v2/services';
import './AccountList.scss';
import DashboardPanel from './DashboardPanel';

interface Props {
  accounts: ExtendedAccount[];
  className?: string;
  deleteAccount(uuid: string): void;
}

const DeleteButton = styled(Button)`
  align-self: flex-start;
  margin-left: 1em;
`;

export default class AccountList extends Component<Props> {
  public handleAccountDelete = (uuid: string) => () => {
    const { deleteAccount } = this.props;
    deleteAccount(uuid);
  };

  public renderRedirect() {
    if (
      this.props.accounts === undefined ||
      this.props.accounts === null ||
      this.props.accounts.length === 0
    ) {
      return <Redirect to="/no-accounts" />;
    }
  }

  public BuildAccountList() {
    const { accounts } = this.props;
    return {
      head: ['Favorite', 'Address', 'Network', 'Value', 'Delete'],
      body: accounts.map(account => {
        return [
          <Icon key={`account-icon${account.uuid}`} icon="star" />,
          <Address
            key={`account-key-${account.value}`}
            title={`${account.label}- (${account.accountType})`}
            address={account.address}
            truncate={truncate}
          />,
          <Network key={`account-network-${account.network}`} color="#a682ff">
            {account.network}
          </Network>,
          <Typography key={`account-value-${account.value}`}>{account.value}</Typography>,
          <DeleteButton
            key={`account-id-${account.uuid}`}
            onClick={this.handleAccountDelete(account.uuid)}
            icon="exit"
          />
        ];
      }),
      config: {
        primaryColumn: 'Address',
        sortableColumn: 'Address',
        sortFunction: (a: any, b: any) => {
          const aLabel = a.props.label;
          const bLabel = b.props.label;
          return aLabel === bLabel ? true : aLabel.localeCompare(bLabel);
        },
        hiddenHeadings: ['Favorite', 'Delete'],
        iconColumns: ['Favorite', 'Delete']
      }
    };
  }
  public render() {
    const { className } = this.props;

    return (
      <DashboardPanel
        heading="Your Accounts"
        action="Add Account"
        actionLink="/dashboard/add-account"
        className={`AccountList ${className}`}
      >
        <CollapsibleTable breakpoint={450} {...this.BuildAccountList()} />
        {this.renderRedirect()}
      </DashboardPanel>
    );
  }
}
