// @flow
import './DerivedKeyModal.scss';
import React from 'react';
import { connect } from 'react-redux';
import Modal from 'components/ui/Modal';
import { getDerivedWallets, setDesiredToken } from 'actions/derivedWallets';
import { toUnit, toTokenUnit } from 'libs/units';
import { getNetworkConfig } from 'selectors/config';
import { getTokens } from 'selectors/wallet';

import type {
  DerivedWallet,
  GetDerivedWalletsArgs,
  GetDerivedWalletsAction,
  SetDesiredTokenAction
} from 'actions/derivedWallets';
import type { NetworkConfig, Token } from 'config/data';

const WALLETS_PER_PAGE = 5;

type Props = {
  // Redux state
  wallets: DerivedWallet[],
  desiredToken: string,
  network: NetworkConfig,
  tokens: Token[],

  // Redux actions
  getDerivedWallets: GetDerivedWalletsArgs => GetDerivedWalletsAction,
  setDesiredToken: (tkn: ?string) => SetDesiredTokenAction,

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

  _handleChangeToken = (ev: SyntheticInputEvent) => {
    this.props.setDesiredToken(ev.target.value || null);
  };

  _handleConfirmAddress = () => {
    if (this.state.selectedAddress) {
      this.props.onConfirmAddress(this.state.selectedAddress);
    }
  };

  _selectAddress(selectedAddress) {
    this.setState({ selectedAddress });
  }

  _renderWalletRow(wallet) {
    const { desiredToken, tokens } = this.props;
    const { selectedAddress } = this.state;
    const token = tokens.find(t => t.symbol === desiredToken);

    // Get renderable values, but keep 'em short
    const value = wallet.value
      ? toUnit(wallet.value, 'wei', 'ether').toPrecision(4)
      : '0';
    const tokenValue =
      token && wallet.tokenValues[desiredToken]
        ? wallet.tokenValues[desiredToken].toPrecision(4)
        : '';

    return (
      <tr
        key={wallet.address}
        onClick={this._selectAddress.bind(this, wallet.address)}
      >
        <td>
          {wallet.index + 1}
        </td>
        <td className="DKModal-addresses-table-address">
          <input
            type="radio"
            name="selectedAddress"
            selected={wallet.address === selectedAddress}
            value={wallet.address}
          />
          {wallet.address}
        </td>
        <td>
          {value}
        </td>
        <td>
          {tokenValue}
        </td>
        <td>
          <a
            target="_blank"
            href={`https://ethplorer.io/address/${wallet.address}`}
          >
            <i className="DKModal-addresses-table-more" />
          </a>
        </td>
      </tr>
    );
  }

  render() {
    const {
      wallets,
      desiredToken,
      network,
      tokens,
      onCancel,
      walletType
    } = this.props;

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
              value=""
            >
              <option>Trezor (ETH)</option>
            </select>
          </label>

          <div className="DKModal-addresses">
            <table className="DKModal-addresses-table table table-striped table-hover">
              <thead>
                <tr>
                  <td>#</td>
                  <td>Address</td>
                  <td>
                    {network.unit}
                  </td>
                  <td>
                    <select
                      className="DKModal-addresses-table-token"
                      value={desiredToken}
                      onChange={this._handleChangeToken}
                    >
                      <option>-Token-</option>
                      {tokens.map(t =>
                        <option key={t.symbol} value={t.symbol}>
                          {t.symbol}
                        </option>
                      )}
                    </select>
                  </td>
                  <td>More info</td>
                </tr>
              </thead>
              <tbody>
                {wallets.map(wallet => this._renderWalletRow(wallet))}
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
    wallets: state.derivedWallets.wallets,
    desiredToken: state.derivedWallets.desiredToken,
    network: getNetworkConfig(state),
    tokens: getTokens(state)
  };
}

export default connect(mapStateToProps, {
  getDerivedWallets,
  setDesiredToken
})(DerivedKeyModal);
