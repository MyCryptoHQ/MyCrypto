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
  walletType?: string;
  dPath: string;
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
  onPathChange(path: string): void;
}

interface State {
  currentLabel: string;
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
    currentLabel: '',
    page: 0
  };

  public componentDidMount() {
    this.getAddresses();
  }

  public componentWillReceiveProps(nextProps: Props) {
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
        title={translateRaw(`DECRYPT_PROMPT_UNLOCK_${walletType}`)}
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
                className=""
                value={this.state.currentLabel || this.findDPath('value', dPath).value}
                onChange={this.handleChangePath}
                options={dPaths.concat([customDPath])}
                optionRenderer={this.renderDPathOption}
                valueRenderer={this.renderDPathOption}
                clearable={false}
                searchable={false}
              />
            </div>
            {this.state.currentLabel === customDPath.label && (
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

  private findDPath = (prop: keyof DPath, cmp: string) => {
    return this.props.dPaths.find(d => d[prop] === cmp) || customDPath;
  };

  private handleChangePath = (newPath: DPath) => {
    const { value: dPathLabel } = newPath;
    const { value } = this.findDPath('value', dPathLabel);

    if (value === customDPath.value) {
      this.setState({ isCustomPath: true, currentLabel: dPathLabel });
    } else {
      this.setState({ isCustomPath: false, currentLabel: dPathLabel });
      this.props.onPathChange(value);
    }
  };

  private handleChangeCustomPath = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({ customPath: ev.currentTarget.value });
  };

  private handleSubmitCustomPath = (ev: React.FormEvent<HTMLFormElement>) => {
    const { customPath, currentLabel } = this.state;
    ev.preventDefault();

    if (currentLabel === customDPath.label && isValidPath(customPath)) {
      this.props.onPathChange(customPath);
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
      return translate('ADD_Radio_5_PathCustom');
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
          {token ? (
            <UnitDisplay
              decimal={token.decimal}
              value={token.value}
              symbol={desiredToken}
              displayShortBalance={true}
              checkOffline={true}
            />
          ) : (
            '???'
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
