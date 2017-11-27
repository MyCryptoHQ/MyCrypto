import React, { Component } from 'react';
import translate from 'translations';
import { donationAddressMap } from 'config/data';
import { isValidETHAddress } from 'libs/validators';
import { AddressOnlyWallet } from 'libs/wallet';

interface Props {
  onUnlock(param: any): void;
}

interface State {
  address: string;
}

export default class ViewOnlyDecrypt extends Component<Props, State> {
  public state = {
    address: ''
  };

  public render() {
    const { address } = this.state;
    const isValid = isValidETHAddress(address);

    return (
      <section className="col-md-4 col-sm-6">
        <div id="selectedUploadKey">
          <h4>{translate('MYWAL_Address')}</h4>

          <form className="form-group" onSubmit={this.openWallet}>
            <input
              className={`form-control
                ${isValid ? 'is-valid' : 'is-invalid'}
              `}
              onChange={this.changeAddress}
              value={address}
              placeholder={donationAddressMap.ETH}
            />

            <button className="btn btn-primary btn-block" disabled={!isValid}>
              {translate('NAV_ViewWallet')}
            </button>
          </form>
        </div>
      </section>
    );
  }

  private changeAddress = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({ address: ev.currentTarget.value });
  };

  private openWallet = (ev: React.SyntheticEvent<HTMLFormElement>) => {
    const { address } = this.state;
    ev.preventDefault();
    if (isValidETHAddress(address)) {
      const wallet = new AddressOnlyWallet(address);
      this.props.onUnlock(wallet);
    }
  };
}
