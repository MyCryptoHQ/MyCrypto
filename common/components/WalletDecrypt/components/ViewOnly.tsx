import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { AddressOnlyWallet } from 'libs/wallet';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { ICurrentTo } from 'features/types';
import { configSelectors } from 'features/config';
import { ensSelectors } from 'features/ens';
import { AddressField } from 'components';
import './ViewOnly.scss';

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  isValidAddress: ReturnType<typeof configSelectors.getIsValidAddressFn>;
  currentAddress: ICurrentTo;
  resolvedAddress: ReturnType<typeof ensSelectors.getResolvedAddress>;
}

type Props = OwnProps & StateProps;

interface State {
  addressFromBook: string;
}

class ViewOnlyDecryptClass extends PureComponent<Props, State> {
  public state: State = {
    addressFromBook: ''
  };

  public render() {
    const { isValidAddress, currentAddress, resolvedAddress } = this.props;
    const { addressFromBook } = this.state;
    const isValid =
      isValidAddress(currentAddress.raw) || (resolvedAddress && isValidAddress(resolvedAddress));

    return (
      <div className="ViewOnly">
        <form className="form-group" onSubmit={this.openWallet}>
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
                data-testid="view-only-input"
              />
              <button
                className="ViewOnly-submit btn btn-primary btn-block"
                disabled={!isValid}
                data-testid="view-only-button"
              >
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
    this.setState({ addressFromBook }, this.openWallet);
  };

  private openWallet = () => {
    const { isValidAddress, currentAddress, resolvedAddress } = this.props;
    const { addressFromBook } = this.state;

    if (isValidAddress(addressFromBook)) {
      const wallet = new AddressOnlyWallet(addressFromBook);
      this.props.onUnlock(wallet);
    } else if (isValidAddress(currentAddress.raw)) {
      const wallet = new AddressOnlyWallet(currentAddress.raw);
      this.props.onUnlock(wallet);
    } else if (resolvedAddress && isValidAddress(resolvedAddress)) {
      const wallet = new AddressOnlyWallet(resolvedAddress);
      this.props.onUnlock(wallet);
    }
  };
}

export const ViewOnlyDecrypt = connect((state: AppState): StateProps => ({
  currentAddress: selectors.getCurrentTo(state),
  isValidAddress: configSelectors.getIsValidAddressFn(state),
  resolvedAddress: ensSelectors.getResolvedAddress(state)
}))(ViewOnlyDecryptClass);
