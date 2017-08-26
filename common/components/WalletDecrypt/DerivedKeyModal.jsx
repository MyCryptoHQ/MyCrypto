// @flow
import './DerivedKeyModal.scss';
import React from 'react';
import { connect } from 'react-redux';
import Modal from 'components/ui/Modal';
import { getDerivedWallets, setDesiredToken } from 'actions/derivedWallets';
import { toUnit } from 'libs/units';
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
  dPaths: { label: string, value: string }[],
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
    this._getAddresses();
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

  _getAddresses(props: Props = this.props) {
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

  _handleChangePath = (ev: SyntheticInputEvent) => {
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

  _nextPage = () => {
    this.setState({ page: this.state.page + 1 }, this._getAddresses);
  };

  _prevPage = () => {
    this.setState(
      { page: Math.max(this.state.page - 1, 0) },
      this._getAddresses
    );
  };

  _renderWalletRow(wallet) {
    const { desiredToken, network } = this.props;
    const { selectedAddress } = this.state;

    // Get renderable values, but keep 'em short
    const value = wallet.value
      ? toUnit(wallet.value, 'wei', 'ether').toPrecision(4)
      : '';
    const tokenValue = wallet.tokenValues[desiredToken]
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
            checked={selectedAddress === wallet.address}
            value={wallet.address}
          />
          {wallet.address}
        </td>
        <td>
          {value} {network.unit}
        </td>
        <td>
          {tokenValue} {desiredToken}
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
      dPath,
      dPaths,
      onCancel,
      walletType
    } = this.props;
    const { selectedAddress, page } = this.state;

    const buttons = [
      {
        text: 'Unlock this Address',
        type: 'primary',
        onClick: this._handleConfirmAddress,
        disabled: !selectedAddress
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
              onChange={this._handleChangePath}
              value={dPath}
            >
              {dPaths.map(dp =>
                <option key={dp.value} value={dp.value}>
                  {dp.label}
                </option>
              )}
              <option value="custom">Custom...</option>
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
                  <td>More</td>
                </tr>
              </thead>
              <tbody>
                {wallets.map(wallet => this._renderWalletRow(wallet))}
              </tbody>
            </table>

            <div className="DKModal-addresses-nav">
              <button
                className="DKModal-addresses-nav-btn btn btn-sm btn-default"
                disabled={page === 0}
                onClick={this._prevPage}
              >
                ← Back
              </button>
              <button
                className="DKModal-addresses-nav-btn btn btn-sm btn-default"
                onClick={this._nextPage}
              >
                More →
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
