import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Select, { Option } from 'react-select';

import translate, { translateRaw } from 'translations';
import { AddressOnlyWallet } from 'libs/wallet';
import { AppState } from 'features/reducers';
import { getIsValidAddressFn } from 'features/config';
import { walletSelectors } from 'features/wallet';
import { Input, Identicon } from 'components/ui';
import { AddressField } from 'components';
import './ViewOnly.scss';

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  recentAddresses: ReturnType<typeof walletSelectors.getRecentAddresses>;
  isValidAddress: ReturnType<typeof getIsValidAddressFn>;
}

type Props = OwnProps & StateProps;

interface State {
  address: string;
  addressFromBook: string;
}

class ViewOnlyDecryptClass extends PureComponent<Props, State> {
  public state = {
    address: '',
    addressFromBook: ''
  };

  public render() {
    const { recentAddresses, isValidAddress } = this.props;
    const { address, addressFromBook } = this.state;
    const isValid = isValidAddress(address);
    const or = <em className="ViewOnly-recent-separator">{translate('OR')}</em>;

    const recentOptions = (recentAddresses.map(addr => ({
      label: (
        <React.Fragment>
          <Identicon address={addr} />
          {addr}
        </React.Fragment>
      ),
      value: addr
      // I hate this assertion, but React elements definitely work as labels
    })) as any) as Option[];

    return (
      <div className="ViewOnly">
        <form className="form-group" onSubmit={this.openWalletWithAddress}>
          {!!recentOptions.length && (
            <div className="ViewOnly-recent">
              <Select
                value={address}
                onChange={this.handleSelectAddress}
                options={recentOptions}
                placeholder={translateRaw('VIEW_ONLY_RECENT')}
              />
              {or}
            </div>
          )}
          <div className="ViewOnly-book">
            <AddressField
              value={addressFromBook}
              showInputLabel={false}
              showIdenticon={false}
              placeholder={translateRaw('SELECT_FROM_ADDRESS_BOOK')}
              onChangeOverride={this.handleSelectAddressFromBook}
              dropdownThreshold={0}
            />
            {or}
          </div>
          <Input
            isValid={isValid}
            className="ViewOnly-input"
            value={address}
            onChange={this.changeAddress}
            placeholder={translateRaw('VIEW_ONLY_ENTER')}
          />
          <button className="ViewOnly-submit btn btn-primary btn-block" disabled={!isValid}>
            {translate('VIEW_ADDR')}
          </button>
        </form>
      </div>
    );
  }

  private changeAddress = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({ address: ev.currentTarget.value });
  };

  private handleSelectAddress = (option: Option) => {
    const address = option && option.value ? option.value.toString() : '';
    this.setState({ address }, this.openWalletWithAddress);
  };

  private handleSelectAddressFromBook = (ev: React.FormEvent<HTMLInputElement>) => {
    const { currentTarget: { value: addressFromBook } } = ev;
    this.setState({ addressFromBook }, this.openWalletWithAddressBook);
  };

  private openWalletWithAddress = (ev?: React.FormEvent<HTMLElement>) => {
    const { address } = this.state;

    if (ev) {
      ev.preventDefault();
    }

    this.openWallet(address);
  };

  private openWalletWithAddressBook = () => {
    const { addressFromBook } = this.state;

    this.openWallet(addressFromBook);
  };

  private openWallet = (address: string) => {
    const { isValidAddress } = this.props;

    if (isValidAddress(address)) {
      const wallet = new AddressOnlyWallet(address);
      this.props.onUnlock(wallet);
    }
  };
}

export const ViewOnlyDecrypt = connect((state: AppState): StateProps => ({
  recentAddresses: walletSelectors.getRecentAddresses(state),
  isValidAddress: getIsValidAddressFn(state)
}))(ViewOnlyDecryptClass);
