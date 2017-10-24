import {
  DeterministicWalletData,
  getDeterministicWallets,
  GetDeterministicWalletsAction,
  GetDeterministicWalletsArgs,
  setDesiredToken,
  SetDesiredTokenAction
} from 'actions/deterministicWallets';
import Modal, { IButton } from 'components/ui/Modal';
import { NetworkConfig } from 'config/data';
import { isValidPath } from 'libs/validators';
import React from 'react';
import { connect } from 'react-redux';
import { getNetworkConfig } from 'selectors/config';
import { getTokens, MergedToken } from 'selectors/wallet';
import './DeterministicWalletsModal.scss';

const WALLETS_PER_PAGE = 5;

interface Props {
  // Passed props
  isOpen?: boolean;
  walletType?: string;
  dPath: string;
  dPaths: { label: string; value: string }[];
  publicKey?: string;
  chainCode?: string;
  seed?: string;

  // Redux state
  wallets: DeterministicWalletData[];
  desiredToken: string;
  network: NetworkConfig;
  tokens: MergedToken[];

  // Redux actions
  getDeterministicWallets(
    args: GetDeterministicWalletsArgs
  ): GetDeterministicWalletsAction;
  setDesiredToken(tkn: string | undefined): SetDesiredTokenAction;

  onCancel(): void;
  onConfirmAddress(address: string, addressIndex: number): void;
  onPathChange(path: string): void;
}

interface State {
  selectedAddress: string;
  selectedAddrIndex: number;
  isCustomPath: boolean;
  customPath: string;
  page: number;
}

class DeterministicWalletsModal extends React.Component<Props, State> {
  public state = {
    selectedAddress: '',
    selectedAddrIndex: 0,
    isCustomPath: false,
    customPath: '',
    page: 0
  };

  public componentDidMount() {
    this.getAddresses();
  }

  public componentWillReceiveProps(nextProps) {
    const { publicKey, chainCode, seed, dPath } = this.props;
    if (
      nextProps.publicKey !== publicKey ||
      nextProps.chainCode !== chainCode ||
      nextProps.dPath !== dPath ||
      nextProps.seed !== seed
    ) {
      this.getAddresses(nextProps);
    }
  }

  public render() {
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
    const { selectedAddress, isCustomPath, customPath, page } = this.state;
    const validPathClass = isValidPath(customPath) ? 'is-valid' : 'is-invalid';

    const buttons: IButton[] = [
      {
        text: 'Unlock this Address',
        type: 'primary',
        onClick: this.handleConfirmAddress,
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
        <div className="DWModal">
          <form
            className="DWModal-path form-group-sm"
            onSubmit={this.handleSubmitCustomPath}
          >
            <span className="DWModal-path-label">Addresses for</span>
            <select
              className="form-control"
              onChange={this.handleChangePath}
              value={isCustomPath ? 'custom' : dPath}
            >
              {dPaths.map(dp => (
                <option key={dp.value} value={dp.value}>
                  {dp.label}
                </option>
              ))}
              <option value="custom">Custom path...</option>
            </select>
            {isCustomPath && (
              <input
                className={`form-control ${validPathClass}`}
                value={customPath}
                placeholder="m/44'/60'/0'/0"
                onChange={this.handleChangeCustomPath}
              />
            )}
          </form>

          <div className="DWModal-addresses">
            <table className="DWModal-addresses-table table table-striped table-hover">
              <thead>
                <tr>
                  <td>#</td>
                  <td>Address</td>
                  <td>{network.unit}</td>
                  <td>
                    <select
                      className="DWModal-addresses-table-token"
                      value={desiredToken}
                      onChange={this.handleChangeToken}
                    >
                      <option value="">-Token-</option>
                      {tokens.map(t => (
                        <option key={t.symbol} value={t.symbol}>
                          {t.symbol}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>More</td>
                </tr>
              </thead>
              <tbody>
                {wallets.map(wallet => this.renderWalletRow(wallet))}
              </tbody>
            </table>

            <div className="DWModal-addresses-nav">
              <button
                className="DWModal-addresses-nav-btn btn btn-sm btn-default"
                disabled={page === 0}
                onClick={this.prevPage}
              >
                ← Back
              </button>
              <button
                className="DWModal-addresses-nav-btn btn btn-sm btn-default"
                onClick={this.nextPage}
              >
                More →
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  private getAddresses(props: Props = this.props) {
    const { dPath, publicKey, chainCode, seed } = props;

    if (dPath && ((publicKey && chainCode) || seed) && isValidPath(dPath)) {
      this.props.getDeterministicWallets({
        seed,
        dPath,
        publicKey,
        chainCode,
        limit: WALLETS_PER_PAGE,
        offset: WALLETS_PER_PAGE * this.state.page
      });
    }
  }

  private handleChangePath = (ev: React.SyntheticEvent<HTMLSelectElement>) => {
    const { value } = ev.target as HTMLSelectElement;

    if (value === 'custom') {
      this.setState({ isCustomPath: true });
    } else {
      this.setState({ isCustomPath: false });
      if (this.props.dPath !== value) {
        this.props.onPathChange(value);
      }
    }
  };

  private handleChangeCustomPath = (
    ev: React.SyntheticEvent<HTMLInputElement>
  ) => {
    this.setState({ customPath: (ev.target as HTMLInputElement).value });
  };

  private handleSubmitCustomPath = (
    ev: React.SyntheticEvent<HTMLFormElement>
  ) => {
    ev.preventDefault();
    if (!isValidPath(this.state.customPath)) {
      return;
    }
    this.props.onPathChange(this.state.customPath);
  };

  private handleChangeToken = (ev: React.SyntheticEvent<HTMLSelectElement>) => {
    this.props.setDesiredToken(
      (ev.target as HTMLSelectElement).value || undefined
    );
  };

  private handleConfirmAddress = () => {
    if (this.state.selectedAddress) {
      this.props.onConfirmAddress(
        this.state.selectedAddress,
        this.state.selectedAddrIndex
      );
    }
  };

  private selectAddress(selectedAddress, selectedAddrIndex) {
    this.setState({ selectedAddress, selectedAddrIndex });
  }

  private nextPage = () => {
    this.setState({ page: this.state.page + 1 }, this.getAddresses);
  };

  private prevPage = () => {
    this.setState(
      { page: Math.max(this.state.page - 1, 0) },
      this.getAddresses
    );
  };

  private renderWalletRow(wallet) {
    const { desiredToken, network } = this.props;
    const { selectedAddress } = this.state;

    // Get renderable values, but keep 'em short
    const value = wallet.value ? wallet.value.toEther().toPrecision(4) : '';
    const tokenValue = wallet.tokenValues[desiredToken]
      ? wallet.tokenValues[desiredToken].toPrecision(4)
      : '';

    return (
      <tr
        key={wallet.address}
        onClick={this.selectAddress.bind(this, wallet.address, wallet.index)}
      >
        <td>{wallet.index + 1}</td>
        <td className="DWModal-addresses-table-address">
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
            <i className="DWModal-addresses-table-more" />
          </a>
        </td>
      </tr>
    );
  }
}

function mapStateToProps(state) {
  return {
    wallets: state.deterministicWallets.wallets,
    desiredToken: state.deterministicWallets.desiredToken,
    network: getNetworkConfig(state),
    tokens: getTokens(state)
  };
}

export default connect(mapStateToProps, {
  getDeterministicWallets,
  setDesiredToken
})(DeterministicWalletsModal);
