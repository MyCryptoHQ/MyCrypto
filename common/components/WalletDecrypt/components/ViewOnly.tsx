import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { AddressOnlyWallet } from 'libs/wallet';
import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';
import { ensSelectors } from 'features/ens';
import { AddressField } from 'components';
import './ViewOnly.scss';

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  isValidAddress: ReturnType<typeof configSelectors.getIsValidAddressFn>;
  resolvedAddress: ReturnType<typeof ensSelectors.getResolvedAddress>;
}

type Props = OwnProps & StateProps;

interface State {
  address: string;
  addressFromBook: string;
}

class ViewOnlyDecryptClass extends PureComponent<Props, State> {
  public state = {
    address: this.props.resolvedAddress || '',
    addressFromBook: ''
  };

  public componentDidUpdate({ resolvedAddress: prevResolvedAddress }: Props) {
    const { resolvedAddress } = this.props;

    if (resolvedAddress !== prevResolvedAddress) {
      this.setState({ address: resolvedAddress || '' });
    }
  }

  public render() {
    const { isValidAddress } = this.props;
    const { address, addressFromBook } = this.state;
    const isValid = isValidAddress(address);

    return (
      <div className="ViewOnly">
        <form className="form-group" onSubmit={this.openWalletWithAddress}>
          <section className="ViewOnly-fields">
            <section className="ViewOnly-fields-field">
              <AddressField
                value={addressFromBook}
                showInputLabel={false}
                showIdenticon={false}
                showEnsResolution={false}
                placeholder={translateRaw('SELECT_FROM_ADDRESS_BOOK')}
                onChangeOverride={this.handleSelectAddressFromBook}
                dropdownThreshold={0}
              />
            </section>
            <section className="ViewOnly-fields-field">
              <em>{translate('OR')}</em>
            </section>
            <section className="ViewOnly-fields-field">
              <AddressField
                showInputLabel={false}
                showIdenticon={false}
                placeholder={translateRaw('VIEW_ONLY_ENTER')}
              />
              <button className="ViewOnly-submit btn btn-primary btn-block" disabled={!isValid}>
                {translate('VIEW_ADDR')}
              </button>
            </section>
          </section>
        </form>
      </div>
    );
  }

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
  isValidAddress: configSelectors.getIsValidAddressFn(state),
  resolvedAddress: ensSelectors.getResolvedAddress(state)
}))(ViewOnlyDecryptClass);
