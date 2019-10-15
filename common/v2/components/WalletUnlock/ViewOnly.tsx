import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { ICurrentTo } from 'features/types';
import { configSelectors } from 'features/config';
import { ensSelectors } from 'features/ens';
import { AddressField } from 'components';

import { WalletId } from 'v2/types';
import { WalletFactory } from 'v2/services/WalletService';
import './ViewOnly.scss';

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  isValidAddress: ReturnType<typeof configSelectors.getIsValidAddressFn>;
  currentAddress: ICurrentTo;
  resolvedAddress: ReturnType<typeof ensSelectors.getResolvedAddress>;
}

interface State {
  addressFromBook: string;
}

const WalletService = WalletFactory(WalletId.VIEW_ONLY);

class ViewOnlyDecryptClass extends PureComponent<OwnProps & StateProps, State> {
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
        <div className="ViewOnly-title"> {translateRaw('INPUT_PUBLIC_ADDRESS_LABEL')}</div>
        <form className="form-group" onSubmit={this.handleSubmit}>
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
    const {
      currentTarget: { value: addressFromBook }
    } = ev;
    this.setState({ addressFromBook });
  };

  private handleSubmit = (e: React.SyntheticEvent<HTMLElement>) => {
    const { isValidAddress, currentAddress, resolvedAddress } = this.props;
    const { addressFromBook } = this.state;
    let wallet;

    if (isValidAddress(addressFromBook)) {
      wallet = addressFromBook;
    } else if (isValidAddress(currentAddress.raw)) {
      wallet = currentAddress.raw;
    } else if (resolvedAddress && isValidAddress(resolvedAddress)) {
      wallet = resolvedAddress;
    }

    if (wallet) {
      e.preventDefault();
      e.stopPropagation();
      this.props.onUnlock(WalletService.init(wallet));
    }
  };
}

export const ViewOnlyDecrypt = connect(
  (state: AppState): StateProps => ({
    currentAddress: selectors.getCurrentTo(state),
    isValidAddress: configSelectors.getIsValidAddressFn(state),
    resolvedAddress: ensSelectors.getResolvedAddress(state)
  })
)(ViewOnlyDecryptClass);
