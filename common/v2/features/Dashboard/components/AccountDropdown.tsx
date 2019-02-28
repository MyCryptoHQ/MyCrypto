import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import { Button, Identicon } from '@mycrypto/ui';

import './AccountDropdown.scss';

interface AccountDropdownEntry {
  uuid: string;
  name: string;
  address: string;
  visible: boolean;
}

interface Props {
  accounts: AccountDropdownEntry[];
  visibleCount: number;
  allVisible: boolean;
  onSelectAll(): void;
  onSelect(uuid: string): void;
}

export class AccountDropdown extends Component<Props> {
  public state = {
    open: false
  };

  public handleClickOutside = () => this.state.open && this.toggleOpen();

  public render() {
    const { accounts, visibleCount, allVisible, onSelectAll, onSelect } = this.props;
    const { open } = this.state;
    const label = allVisible
      ? 'All Accounts'
      : `Viewing ${visibleCount} of ${accounts.length} Accounts`;

    return (
      <div role="button" onClick={this.toggleOpen} className="AccountDropdown">
        {label}
        {open && (
          <div className="AccountDropdown-menu" onClick={e => e.stopPropagation()}>
            <label htmlFor="all-accounts" onClick={onSelectAll}>
              <input
                type="checkbox"
                name="all-accounts"
                checked={allVisible}
                onChange={onSelectAll}
              />
              All Accounts
            </label>
            {accounts.map(({ uuid, name, address, visible }) => (
              <label key={uuid} htmlFor={`account-${uuid}`} onClick={() => onSelect(uuid)}>
                <input
                  type="checkbox"
                  name={`account-${uuid}`}
                  checked={visible}
                  onChange={() => onSelect(uuid)}
                />
                <Identicon className="AccountDropdown-menu-identicon" address={address} />
                {name}
              </label>
            ))}
            <Button className="AccountDropdown-menu-apply" onClick={this.toggleOpen}>
              Apply
            </Button>
          </div>
        )}
      </div>
    );
  }

  private toggleOpen = () =>
    this.setState(prevState => ({
      open: !prevState.open
    }));
}

const ModifiedAccountDropdown = onClickOutside(AccountDropdown);

// tslint:disable-next-line
export default class MockContext extends Component {
  public state = {
    accountsById: {
      '1': {
        uuid: '1',
        name: 'Example account one',
        address: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d'
      },
      '2': {
        uuid: '2',
        name: 'An account with a really, really, really, really, really, really long name',
        address: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d'
      }
    },
    allAccounts: ['1', '2'],
    visibleAccounts: ['1', '2']
  };

  public render() {
    const { accountsById, allAccounts, visibleAccounts } = this.state;
    const accounts = allAccounts.map(uuid => ({
      ...accountsById[uuid],
      visible: visibleAccounts.includes(uuid)
    }));

    return (
      <ModifiedAccountDropdown
        accounts={accounts}
        visibleCount={visibleAccounts.length}
        allVisible={allAccounts.length === visibleAccounts.length}
        onSelectAll={this.toggleAllAccounts}
        onSelect={this.toggleSingleAccount}
      />
    );
  }

  private toggleAllAccounts = () =>
    this.setState(prevState => ({
      visibleAccounts:
        prevState.visibleAccounts.length < prevState.allAccounts.length
          ? [...prevState.allAccounts]
          : []
    }));

  private toggleSingleAccount = uuid =>
    this.setState(prevState => ({
      visibleAccounts: prevState.visibleAccounts.includes(uuid)
        ? prevState.visibleAccounts.filter(entry => entry !== uuid)
        : prevState.visibleAccounts.concat(uuid)
    }));
}
