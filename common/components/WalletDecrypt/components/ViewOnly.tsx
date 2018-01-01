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

export class ViewOnlyDecrypt extends Component<Props, State> {
  public state = {
    address: ''
  };

  public render() {
    const { address } = this.state;
    const isValid = isValidETHAddress(address);

    return (
      <div id="selectedUploadKey">
        <form className="form-group" onSubmit={this.openWallet}>
          <textarea
            className={`form-control
              ${isValid ? 'is-valid' : 'is-invalid'}
            `}
            value={address}
            onChange={this.changeAddress}
            onKeyDown={this.handleEnterKey}
            placeholder={donationAddressMap.ETH}
            rows={3}
          />

          <button className="btn btn-primary btn-block" disabled={!isValid}>
            {translate('NAV_ViewWallet')}
          </button>
        </form>
      </div>
    );
  }

  private changeAddress = (ev: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({ address: ev.currentTarget.value });
  };

  private handleEnterKey = (ev: React.KeyboardEvent<HTMLElement>) => {
    if (ev.keyCode === 13) {
      this.openWallet(ev);
    }
  };

  private openWallet = (ev: React.FormEvent<HTMLElement>) => {
    const { address } = this.state;
    ev.preventDefault();
    if (isValidETHAddress(address)) {
      const wallet = new AddressOnlyWallet(address);
      this.props.onUnlock(wallet);
    }
  };
}
