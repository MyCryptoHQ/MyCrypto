import React from 'react';
import Select, { Option } from 'react-select';
import { connect } from 'react-redux';
import { Table } from '@mycrypto/ui';

import translate, { translateRaw } from 'translations';
import { isValidPath } from 'libs/validators';
import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';
import * as selectors from 'features/selectors';
import {
  deterministicWalletsTypes,
  deterministicWalletsActions
} from 'features/deterministicWallets';
import { addressBookSelectors } from 'features/addressBook';
import { UnitDisplay, Input } from 'components/ui';
import './DeterministicWalletsModal.scss';
import { truncate } from 'v2/libs';

const WALLETS_PER_PAGE = 5;

interface OwnProps {
  dPath: DPath;
  dPaths: DPath[];
  publicKey?: string;
  chainCode?: string;
  seed?: string;
}

interface StateProps {
  addressLabels: ReturnType<typeof addressBookSelectors.getAddressLabels>;
  wallets: AppState['deterministicWallets']['wallets'];
  desiredToken: AppState['deterministicWallets']['desiredToken'];
  network: ReturnType<typeof configSelectors.getNetworkConfig>;
  tokens: ReturnType<typeof selectors.getTokens>;
}

interface DispatchProps {
  getDeterministicWallets(
    args: deterministicWalletsTypes.GetDeterministicWalletsArgs
  ): deterministicWalletsTypes.GetDeterministicWalletsAction;
  setDesiredToken(tkn: string | undefined): deterministicWalletsTypes.SetDesiredTokenAction;
  onCancel(): void;
  onConfirmAddress(address: string, addressIndex: number): void;
  onPathChange(dPath: DPath): void;
}

type Props = OwnProps & StateProps & DispatchProps;

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
    const { wallets, network, dPaths, onCancel } = this.props;
    const { selectedAddress, customPath, page } = this.state;

    return (
      <>
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
                    isValid={customPath ? isValidPath(customPath) : true}
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
            <Table
              head={['#', 'Address', network.unit, 'Token', translateRaw('ACTION_5')]}
              body={wallets.map(wallet => this.renderWalletRow(wallet))}
              config={{ hiddenHeadings: ['#', translateRaw('ACTION_5')] }}
            />
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

        <button
          className="Modal-footer-btn btn btn-primary"
          onClick={this.handleConfirmAddress}
          disabled={!selectedAddress}
        >
          {translate('ACTION_3')}
        </button>
        <button className="Modal-footer-btn btn btn-default" onClick={onCancel}>
          {translate('ACTION_2')}
        </button>
      </>
    );
  }

  private getAddresses(props: Props = this.props) {
    const { dPath, publicKey, chainCode, seed } = props;
    if (dPath && ((publicKey && chainCode) || seed)) {
      if (isValidPath(dPath.value)) {
        this.props.getDeterministicWallets({
          seed,
          dPath: dPath.value,
          publicKey,
          chainCode,
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

  private renderWalletRow(wallet: deterministicWalletsTypes.DeterministicWalletData) {
    const { desiredToken, network, addressLabels } = this.props;
    const { selectedAddress } = this.state;
    const label = addressLabels[wallet.address.toLowerCase()];
    const spanClassName = label ? 'DWModal-addresses-table-address-text' : '';

    let blockExplorer;
    if (!network.isCustom) {
      blockExplorer = network.blockExplorer;
    } else {
      blockExplorer = {
        addressUrl: (address: string) => {
          return `https://ethplorer.io/address/${address}`;
        }
      };
    }

    // Get renderable values, but keep 'em short
    const token = desiredToken ? wallet.tokenValues[desiredToken] : null;

    // tslint:disable:jsx-key
    return [
      wallet.index + 1,
      <>
        <input
          type="radio"
          name="selectedAddress"
          checked={selectedAddress === wallet.address}
          value={wallet.address}
          readOnly={true}
          onClick={this.selectAddress.bind(this, wallet.address, wallet.index)}
        />
        {label && <label className="DWModal-addresses-table-address-label">{label}</label>}
        <span className={spanClassName}>{truncate(wallet.address)}</span>
      </>,
      <UnitDisplay
        unit={'ether'}
        value={wallet.value}
        symbol={network.unit}
        displayShortBalance={true}
        checkOffline={true}
      />,
      desiredToken ? (
        <UnitDisplay
          decimal={token ? token.decimal : 0}
          value={token ? token.value : null}
          symbol={desiredToken}
          displayShortBalance={true}
          checkOffline={true}
        />
      ) : (
        <span className="DWModal-addresses-table-na">N/A</span>
      ),
      <a target="_blank" href={blockExplorer.addressUrl(wallet.address)} rel="noopener noreferrer">
        <i className="DWModal-addresses-table-more" />
      </a>
    ];
    // tslint:enable:jsx-key
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    addressLabels: addressBookSelectors.getAddressLabels(state),
    wallets: state.deterministicWallets.wallets,
    desiredToken: state.deterministicWallets.desiredToken,
    network: configSelectors.getNetworkConfig(state),
    tokens: selectors.getTokens(state)
  };
}

const DeterministicWalletsModal = connect(mapStateToProps, {
  getDeterministicWallets: deterministicWalletsActions.getDeterministicWallets,
  setDesiredToken: deterministicWalletsActions.setDesiredToken
})(DeterministicWalletsModalClass);

export default DeterministicWalletsModal;
