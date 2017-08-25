// @flow
import './DerivedKeyModal.scss';
import React from 'react';
import { connect } from 'react-redux';
import Modal from 'components/ui/Modal';
import { getDerivedWallets } from 'actions/derivedWallets';
import { toEther } from 'libs/units';
import { getNetworkConfig } from 'selectors/config';

import type {
  DerivedWallet,
  GetDerivedWalletsArgs,
  GetDerivedWalletsAction
} from 'actions/derivedWallets';
import type { NetworkConfig } from 'config/data';

const WALLETS_PER_PAGE = 5;

type Props = {
  // Redux state
  network: NetworkConfig,
  wallets: DerivedWallet[],
  desiredToken: string,

  // Redux actions
  getDerivedWallets: GetDerivedWalletsArgs => GetDerivedWalletsAction,

  // Passed props
  isOpen?: boolean,
  walletType: ?string,
  dPath: string,
  publicKey: string,
  chainCode: string,
  onCancel: () => void,
  onConfirmAddress: string => void,
  onPathChange: string => void
};

type State = {
  selectedAddress: string,
  page: number
};

class DerivedKeyModal extends React.Component {
  props: Props;
  state: State = {
    selectedAddress: '',
    selectedPath: '',
    page: 0
  };

  componentDidMount() {
    this._getAddresses(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { dPath, publicKey, chainCode } = this.props;
    if (
      nextProps.dPath !== dPath ||
      nextProps.publicKey !== publicKey ||
      nextProps.chainCode !== chainCode
    ) {
      this._getAddresses(nextProps);
    }
  }

  _getAddresses(props: Props) {
    const { dPath, publicKey, chainCode } = props;

    if (dPath && publicKey && chainCode) {
      this.props.getDerivedWallets({
        dPath,
        publicKey,
        chainCode,
        limit: WALLETS_PER_PAGE,
        offset: WALLETS_PER_PAGE * this.state.page
      });
    }
  }

  _handlePathChange = (ev: SyntheticInputEvent) => {
    this.props.onPathChange(ev.target.value);
  };

  _handleSelectAddress = ev => {
    this.setState({ selectedAddress: ev.target.value });
  };

  _handleConfirmAddress = () => {
    if (this.state.selectedAddress) {
      this.props.onConfirmAddress(this.state.selectedAddress);
    }
  };

  render() {
    const { wallets, desiredToken, network, onCancel, walletType } = this.props;
    const { selectedAddress } = this.state;

    const buttons = [
      {
        text: 'Unlock this Address',
        type: 'primary',
        onClick: this._handleConfirmAddress
      },
      {
        text: 'Cancel',
        type: 'default',
        onClick: onCancel
      }
    ];

    return (
      <Modal
        title={`Unlock your ${walletType || ''} Wallet`}
        isOpen={this.props.isOpen}
        buttons={buttons}
        handleClose={onCancel}
      >
        <div className="DKModal">
          <label className="DKModal-path">
            <span className="DKModal-path-label">Addresses for</span>
            <select
              className="DKModal-path-select"
              onChange={this._handlePathChange}
            >
              <option>Trezor (ETH)</option>
            </select>
          </label>

          <div className="DKModal-addresses">
            <table className="DKModal-addresses-table">
              <thead>
                <tr>
                  <td>#</td>
                  <td>Address</td>
                  <td>Balance</td>
                  <td>More info</td>
                </tr>
              </thead>
              <tbody>
                {wallets.map(wallet => {
                  return (
                    <tr key={wallet.address}>
                      <td>
                        {wallet.index + 1}
                      </td>
                      <td>
                        <label>
                          <input
                            type="radio"
                            name="selectedAddress"
                            selected={wallet.address === selectedAddress}
                            onChange={this._handleSelectAddress}
                            value={wallet.address}
                          />
                          {wallet.address}
                        </label>
                      </td>
                      <td>
                        {wallet.value && toEther(wallet.value, 'wei')}{' '}
                        {network.unit}
                      </td>
                      <td>
                        {wallet.tokenValues[desiredToken]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="DKModal-addresses-nav">
              <button className="DKModal-addresses-nav-btn DKModal-addresses-nav-btn--prev btn btn-info">
                Back
              </button>
              <button className="DKModal-addresses-nav-btn DKModal-addresses-nav-btn--next btn btn-info">
                More
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    network: getNetworkConfig(state),
    wallets: state.derivedWallets.wallets,
    desiredToken: state.derivedWallets.desiredToken
  };
}

export default connect(mapStateToProps, { getDerivedWallets })(DerivedKeyModal);
