import React from 'react';
import { connect } from 'react-redux';
import Select, { Option } from 'react-select';
import translate, { translateRaw } from 'translations';
import {
  DeterministicWalletData,
  getDeterministicWallets,
  GetDeterministicWalletsAction,
  GetDeterministicWalletsArgs,
  setDesiredToken,
  SetDesiredTokenAction
} from 'actions/deterministicWallets';
import Modal, { IButton } from 'components/ui/Modal';
import { AppState } from 'reducers';
import { isValidPath } from 'libs/validators';
import { getNetworkConfig } from 'selectors/config';
import { getTokens, MergedToken } from 'selectors/wallet';
import { UnitDisplay, Input } from 'components/ui';
import { StaticNetworkConfig } from 'types/network';
import './DeterministicWalletsModal.scss';

const WALLETS_PER_PAGE = 5;

interface Props {
  // Passed props
  isOpen?: boolean;
  dPath: DPath;
  dPaths: DPath[];
  publicKey?: string;
  chainCode?: string;
  seed?: string;

  // Redux state
  wallets: AppState['deterministicWallets']['wallets'];
  desiredToken: AppState['deterministicWallets']['desiredToken'];
  network: StaticNetworkConfig;
  tokens: MergedToken[];

  // Redux actions
  getDeterministicWallets(args: GetDeterministicWalletsArgs): GetDeterministicWalletsAction;
  setDesiredToken(tkn: string | undefined): SetDesiredTokenAction;

  onCancel(): void;
  onConfirmAddress(address: string, addressIndex: number): void;
  onPathChange(dPath: DPath): void;
}

interface State {
  currentDPath: DPath;
  selectedAddress: string;
  selectedAddrIndex: number;
  isCustomPath: boolean;
  customPath: string;
  page: number;
}

const customDPath: DPath = {
  label: 'custom',
  value: 'custom'
};

class DeterministicWalletsModalClass extends React.PureComponent<Props, State> {
  public state: State = {
    selectedAddress: '',
    selectedAddrIndex: 0,
    isCustomPath: false,
    customPath: '',
    currentDPath: this.props.dPath,
    page: 0
  };

  public componentDidMount() {
    this.getAddresses();
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
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
    const { wallets, desiredToken, network, tokens, dPaths, onCancel } = this.props;
    const { selectedAddress, customPath, page } = this.state;

    const buttons: IButton[] = [
      {
        text: translate('ACTION_3'),
        type: 'primary',
        onClick: this.handleConfirmAddress,
        disabled: !selectedAddress
      },
      {
        text: translate('ACTION_2'),
        type: 'default',
        onClick: onCancel
      }
    ];

    return (
      <Modal
        title={translateRaw('DECRYPT_PROMPT_SELECT_ADDRESS')}
        isOpen={this.props.isOpen}
        buttons={buttons}
        handleClose={onCancel}
      >
        <div className="DWModal">
          <form
            className="DWModal-path form-group-sm flex-wrapper"
            onSubmit={this.handleSubmitCustomPath}
          >
            <span className="DWModal-path-label">{translate('DECRYPT_DROPDOWN_LABEL')} </span>
            <div className="DWModal-path-select">
              <Select
                name="fieldDPath"
                value={this.state.currentDPath}
                onChange={this.handleChangePath}
                options={dPaths.concat([customDPath])}
                optionRenderer={this.renderDPathOption}
                valueRenderer={this.renderDPathOption}
                clearable={false}
                searchable={false}
              />
            </div>
            {this.state.currentDPath.label === customDPath.label && (
              <React.Fragment>
                <div className="DWModal-path-custom">
                  <Input
                    className={customPath ? (isValidPath(customPath) ? 'valid' : 'invalid') : ''}
                    value={customPath}
                    placeholder="m/44'/60'/0'/0"
                    onChange={this.handleChangeCustomPath}
                  />
                </div>
                <button
                  className="DWModal-path-submit btn btn-success"
                  disabled={!isValidPath(customPath)}
                >
                  <i className="fa fa-check" />
                </button>
              </React.Fragment>
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
                  <td>{translate('ACTION_5')}</td>
                </tr>
              </thead>
              <tbody>{wallets.map(wallet => this.renderWalletRow(wallet))}</tbody>
            </table>
          </div>
          <div className="DWModal-addresses-nav">
            <button
              className="DWModal-addresses-nav-btn btn btn-sm btn-default"
              disabled={page === 0}
              onClick={this.prevPage}
            >
              ← {translate('ACTION_4')}
            </button>
            <button
              className="DWModal-addresses-nav-btn btn btn-sm btn-default"
              onClick={this.nextPage}
            >
              {translate('ACTION_5')} →
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  private getAddresses(props: Props = this.props) {
    const { dPath, publicKey, chainCode, seed } = props;

    if (dPath && ((publicKey && chainCode) || seed)) {
      if (isValidPath(dPath.value)) {
        this.props.getDeterministicWallets({
          seed,
          publicKey,
          chainCode,
          dPath: dPath.value,
          limit: WALLETS_PER_PAGE,
          offset: WALLETS_PER_PAGE * this.state.page
        });
      } else {
        console.error('Invalid dPath provided', dPath);
      }
    }
  }

  private handleChangePath = (newPath: DPath) => {
    if (newPath.value === customDPath.value) {
      this.setState({ isCustomPath: true, currentDPath: newPath });
    } else {
      this.setState({ isCustomPath: false, currentDPath: newPath });
      this.props.onPathChange(newPath);
    }
  };

  private handleChangeCustomPath = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({ customPath: ev.currentTarget.value });
  };

  private handleSubmitCustomPath = (ev: React.FormEvent<HTMLFormElement>) => {
    const { customPath, currentDPath } = this.state;
    ev.preventDefault();

    if (currentDPath.value === customDPath.value && isValidPath(customPath)) {
      this.props.onPathChange({
        label: customDPath.label,
        value: customPath
      });
    }
  };

  private handleChangeToken = (ev: React.FormEvent<HTMLSelectElement>) => {
    this.props.setDesiredToken(ev.currentTarget.value || undefined);
  };

  private handleConfirmAddress = () => {
    if (this.state.selectedAddress) {
      this.props.onConfirmAddress(this.state.selectedAddress, this.state.selectedAddrIndex);
    }
  };

  private selectAddress(selectedAddress: string, selectedAddrIndex: number) {
    this.setState({ selectedAddress, selectedAddrIndex });
  }

  private nextPage = () => {
    this.setState({ page: this.state.page + 1 }, this.getAddresses);
  };

  private prevPage = () => {
    this.setState({ page: Math.max(this.state.page - 1, 0) }, this.getAddresses);
  };

  private renderDPathOption(option: Option) {
    if (option.value === customDPath.value) {
      return translate('X_CUSTOM');
    }

    return (
      <React.Fragment>
        {option.label} {option.value && <small>({option.value.toString().replace(' ', '')})</small>}
      </React.Fragment>
    );
  }

  private renderWalletRow(wallet: DeterministicWalletData) {
    const { desiredToken, network } = this.props;
    const { selectedAddress } = this.state;

    // Get renderable values, but keep 'em short
    const token = desiredToken ? wallet.tokenValues[desiredToken] : null;

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
          <UnitDisplay
            unit={'ether'}
            value={wallet.value}
            symbol={network.unit}
            displayShortBalance={true}
            checkOffline={true}
          />
        </td>
        <td>
          {desiredToken ? (
            <UnitDisplay
              decimal={token ? token.decimal : 0}
              value={token ? token.value : null}
              symbol={desiredToken}
              displayShortBalance={true}
              checkOffline={true}
            />
          ) : (
            <span className="DWModal-addresses-table-na">N/A</span>
          )}
        </td>
        <td>
          <a
            target="_blank"
            href={`https://ethplorer.io/address/${wallet.address}`}
            rel="noopener noreferrer"
          >
            <i className="DWModal-addresses-table-more" />
          </a>
        </td>
      </tr>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    wallets: state.deterministicWallets.wallets,
    desiredToken: state.deterministicWallets.desiredToken,
    network: getNetworkConfig(state),
    tokens: getTokens(state)
  };
}

const DeterministicWalletsModal = connect(mapStateToProps, {
  getDeterministicWallets,
  setDesiredToken
})(DeterministicWalletsModalClass);

export default DeterministicWalletsModal;
