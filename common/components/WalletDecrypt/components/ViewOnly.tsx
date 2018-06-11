import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Select, { Option } from 'react-select';
import translate, { translateRaw } from 'translations';
import { isValidAddress } from 'libs/validators';
import { AddressOnlyWallet } from 'libs/wallet';
import { getRecentAddresses } from 'selectors/wallet';
import { AppState } from 'reducers';
import { Input, Identicon } from 'components/ui';
import './ViewOnly.scss';
import { getNetworkConfig } from 'selectors/config';
import { NetworkConfig } from 'types/network';

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  recentAddresses: AppState['wallet']['recentAddresses'];
  network: NetworkConfig;
}

type Props = OwnProps & StateProps;

interface State {
  address: string;
}

class ViewOnlyDecryptClass extends PureComponent<Props, State> {
  public state = {
    address: ''
  };

  public render() {
    const { recentAddresses, network } = this.props;
    const { address } = this.state;
    const isValid = isValidAddress(address, network.chainId);

    const recentOptions = (recentAddresses.map(addr => ({
      label: (
        <React.Fragment>
          <Identicon address={addr} network={network} />
          {addr}
        </React.Fragment>
      ),
      value: addr
      // I hate this assertion, but React elements definitely work as labels
    })) as any) as Option[];

    return (
      <div className="ViewOnly">
        <form className="form-group" onSubmit={this.openWallet}>
          {!!recentOptions.length && (
            <div className="ViewOnly-recent">
              <Select
                value={address}
                onChange={this.handleSelectAddress}
                options={recentOptions}
                placeholder={translateRaw('VIEW_ONLY_RECENT')}
              />
              <em className="ViewOnly-recent-separator">{translate('OR')}</em>
            </div>
          )}

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
    this.setState({ address }, () => this.openWallet());
  };

  private openWallet = (ev?: React.FormEvent<HTMLElement>) => {
    if (ev) {
      ev.preventDefault();
    }

    const { network } = this.props;
    const { address } = this.state;
    if (isValidAddress(address, network.chainId)) {
      const wallet = new AddressOnlyWallet(address);
      this.props.onUnlock(wallet);
    }
  };
}

export const ViewOnlyDecrypt = connect((state: AppState): StateProps => ({
  recentAddresses: getRecentAddresses(state),
  network: getNetworkConfig(state)
}))(ViewOnlyDecryptClass);
