import React from 'react';
import Modal, { IButton } from 'components/ui/Modal';
import translate, { translateRaw } from 'translations';
import { CustomNetworkConfig } from 'types/network';
import { CustomNodeConfig } from 'types/node';
import { TAddCustomNetwork, addCustomNetwork, AddCustomNodeAction } from 'actions/config';
import { connect, Omit } from 'react-redux';
import { AppState } from 'reducers';
import {
  getCustomNetworkConfigs,
  getCustomNodeConfigs,
  getStaticNetworkConfigs
} from 'selectors/config';
import { CustomNode } from 'libs/nodes';
import { Input } from 'components/ui';
import Dropdown from 'components/ui/Dropdown';
import './CustomNodeModal.scss';

const CUSTOM = { label: 'Custom', value: 'custom' };

interface OwnProps {
  isOpen: boolean;
  addCustomNode(payload: AddCustomNodeAction['payload']): void;
  handleClose(): void;
}

interface DispatchProps {
  addCustomNetwork: TAddCustomNetwork;
}

interface StateProps {
  customNodes: AppState['config']['nodes']['customNodes'];
  customNetworks: AppState['config']['networks']['customNetworks'];
  staticNetworks: AppState['config']['networks']['staticNetworks'];
}

interface State {
  name: string;
  url: string;
  network: string;
  customNetworkId: string;
  customNetworkUnit: string;
  customNetworkChainId: string;
  hasAuth: boolean;
  username: string;
  password: string;
}

type Props = OwnProps & StateProps & DispatchProps;

class CustomNodeModal extends React.Component<Props, State> {
  public INITIAL_STATE = {
    name: '',
    url: '',
    network: Object.keys(this.props.staticNetworks)[0],
    customNetworkId: '',
    customNetworkUnit: '',
    customNetworkChainId: '',
    hasAuth: false,
    username: '',
    password: ''
  };
  public state: State = this.INITIAL_STATE;

  public componentDidUpdate(prevProps: Props) {
    // Reset state when modal opens
    if (!prevProps.isOpen && prevProps.isOpen !== this.props.isOpen) {
      this.setState(this.INITIAL_STATE);
    }
  }

  public render() {
    const { customNetworks, handleClose, staticNetworks, isOpen } = this.props;
    const { network } = this.state;
    const isHttps = window.location.protocol.includes('https');
    const invalids = this.getInvalids();

    const buttons: IButton[] = [
      {
        type: 'primary',
        text: translate('NODE_CTA'),
        onClick: this.saveAndAdd,
        disabled: !!Object.keys(invalids).length
      },
      {
        type: 'default',
        text: translate('ACTION_2'),
        onClick: handleClose
      }
    ];

    const conflictedNode = this.getConflictedNode();
    const staticNetwrks = Object.keys(staticNetworks).map(net => {
      return { label: net, value: net };
    });
    const customNetwrks = Object.entries(customNetworks).map(([id, net]) => {
      return { label: net.name + ' (Custom)', value: id };
    });
    const options = [...staticNetwrks, ...customNetwrks, CUSTOM];
    return (
      <Modal
        title={translateRaw('NODE_Title')}
        isOpen={isOpen}
        buttons={buttons}
        handleClose={handleClose}
        maxWidth={580}
      >
        {isHttps && <div className="alert alert-warning small">{translate('NODE_WARNING')}</div>}

        {conflictedNode && (
          <div className="alert alert-warning small">
            {translate('CUSTOM_NODE_CONFLICT', { conflictedNode: conflictedNode.name })}
          </div>
        )}

        <form className="CustomNodeModal">
          <div className="flex-wrapper">
            <label className="col-sm-9 input-group flex-grow-1">
              <div className="input-group-header">{translate('CUSTOM_NODE_NAME')}</div>
              <Input
                className={`input-group-input ${this.state.name && invalids.name ? 'invalid' : ''}`}
                type="text"
                placeholder="My Node"
                value={this.state.name}
                onChange={e => this.setState({ name: e.currentTarget.value })}
              />
            </label>
            <label className="col-sm-3 input-group">
              <div className="input-group-header">Network</div>
              <Dropdown
                className="input-group-dropdown"
                value={network}
                options={options}
                clearable={false}
                onChange={(e: { label: string; value: string }) =>
                  this.setState({ network: e.value })
                }
              />
            </label>
          </div>

          {network === CUSTOM.value && (
            <div className="flex-wrapper">
              <label className="col-sm-6 input-group input-group-inline">
                <div className="input-group-header">{translate('CUSTOM_NETWORK_NAME')}</div>
                <Input
                  className={`input-group-input ${
                    this.state.customNetworkId && invalids.customNetworkId ? 'invalid' : ''
                  }`}
                  type="text"
                  placeholder="My Custom Network"
                  value={this.state.customNetworkId}
                  onChange={e => this.setState({ customNetworkId: e.currentTarget.value })}
                />
              </label>
              <label className="col-sm-3 input-group input-group-inline">
                <div className="input-group-header">{translate('CUSTOM_NETWORK_CURRENCY')}</div>
                <Input
                  className={`input-group-input ${
                    this.state.customNetworkUnit && invalids.customNetworkUnit ? 'invalid' : ''
                  }`}
                  type="text"
                  placeholder="ETH"
                  value={this.state.customNetworkUnit}
                  onChange={e => this.setState({ customNetworkUnit: e.currentTarget.value })}
                />
              </label>
              <label className="col-sm-3 input-group input-group-inline">
                <div className="input-group-header">{translate('CUSTOM_NETWORK_CHAIN_ID')}</div>
                <Input
                  className={`input-group-input ${
                    this.state.customNetworkChainId && invalids.customNetworkChainId
                      ? 'invalid'
                      : ''
                  }`}
                  type="text"
                  placeholder="1"
                  value={this.state.customNetworkChainId}
                  onChange={e => this.setState({ customNetworkChainId: e.currentTarget.value })}
                />
              </label>
            </div>
          )}

          <label className="input-group input-group-inline">
            <div className="input-group-header">{translate('CUSTOM_NETWORK_URL')}</div>
            <Input
              className={`input-group-input ${this.state.url && invalids.url ? 'invalid' : ''}`}
              type="text"
              placeholder="https://127.0.0.1:8545/"
              value={this.state.url}
              onChange={e => this.setState({ url: e.currentTarget.value })}
              autoComplete="off"
            />
          </label>

          <label>
            <input
              type="checkbox"
              name="hasAuth"
              checked={this.state.hasAuth}
              onChange={() => this.setState({ hasAuth: !this.state.hasAuth })}
            />
            <span>{translate('CUSTOM_NETWORK_HTTP_AUTH')}</span>
          </label>

          {this.state.hasAuth && (
            <div className="flex-wrapper ">
              <label className="col-sm-6 input-group input-group-inline">
                <div className="input-group-header">{translate('INPUT_USERNAME_LABEL')}</div>
                <Input
                  className={`input-group-input ${
                    this.state.username && invalids.username ? 'invalid' : ''
                  }`}
                  type="text"
                  value={this.state.username}
                  onChange={e => this.setState({ username: e.currentTarget.value })}
                />
              </label>
              <label className="col-sm-6 input-group input-group-inline">
                <div className="input-group-header">{translate('INPUT_PASSWORD_LABEL')}</div>
                <Input
                  className={`input-group-input ${
                    this.state.password && invalids.password ? 'invalid' : ''
                  }`}
                  type="password"
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.currentTarget.value })}
                />
              </label>
            </div>
          )}
        </form>
      </Modal>
    );
  }

  private getInvalids(): { [key: string]: boolean } {
    const {
      url,
      hasAuth,
      username,
      password,
      network,
      customNetworkId,
      customNetworkUnit,
      customNetworkChainId
    } = this.state;
    const required: (keyof State)[] = ['name', 'url', 'network'];
    const invalids: { [key: string]: boolean } = {};

    // Required fields
    required.forEach(field => {
      if (!this.state[field]) {
        invalids[field] = true;
      }
    });

    // Parse the URL, and make sure what they typed isn't parsed as relative.
    // Not a perfect regex, just checks for protocol + any char
    if (!/^https?:\/\/.+/i.test(url)) {
      invalids.url = true;
    }

    // If they have auth, make sure it's provided
    if (hasAuth) {
      if (!username) {
        invalids.username = true;
      }
      if (!password) {
        invalids.password = true;
      }
    }

    // If they have a custom network, make sure info is provided
    if (network === CUSTOM.value) {
      if (!customNetworkId) {
        invalids.customNetworkId = true;
      }
      if (!customNetworkUnit) {
        invalids.customNetworkUnit = true;
      }

      // Numeric chain ID (if provided)
      const iChainId = parseInt(customNetworkChainId, 10);
      if (!iChainId || iChainId < 0) {
        invalids.customNetworkChainId = true;
      }
    }

    return invalids;
  }

  private makeCustomNetworkConfigFromState(): CustomNetworkConfig {
    const similarNetworkConfig = Object.values(this.props.staticNetworks).find(
      n => n.chainId === +this.state.customNetworkChainId
    );
    const dPathFormats = similarNetworkConfig ? similarNetworkConfig.dPathFormats : null;

    return {
      isCustom: true,
      name: this.state.customNetworkId,
      unit: this.state.customNetworkUnit,
      chainId: this.state.customNetworkChainId ? parseInt(this.state.customNetworkChainId, 10) : 0,
      dPathFormats
    };
  }

  private makeCustomNodeConfigFromState(): CustomNodeConfig {
    const { network, url, name, username, password } = this.state;

    const networkId =
      network === CUSTOM.value
        ? this.makeCustomNetworkId(this.makeCustomNetworkConfigFromState())
        : network;

    const node: Omit<CustomNodeConfig, 'lib'> = {
      isCustom: true,
      service: 'your custom node',
      id: url,
      name: name.trim(),
      url,
      network: networkId,
      ...(this.state.hasAuth
        ? {
            auth: {
              username,
              password
            }
          }
        : {})
    };

    const lib = new CustomNode(node);

    return { ...node, lib };
  }

  private getConflictedNode(): CustomNodeConfig | undefined {
    const { customNodes } = this.props;
    const config = this.makeCustomNodeConfigFromState();

    return customNodes[config.id];
  }

  private saveAndAdd = () => {
    const node = this.makeCustomNodeConfigFromState();

    if (this.state.network === CUSTOM.value) {
      const network = this.makeCustomNetworkConfigFromState();

      this.props.addCustomNetwork({ config: network, id: node.network });
    }

    this.props.addCustomNode({ config: node, id: node.id });
  };

  private makeCustomNetworkId(config: CustomNetworkConfig): string {
    return config.chainId ? `${config.chainId}` : `${config.name}:${config.unit}`;
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  customNetworks: getCustomNetworkConfigs(state),
  customNodes: getCustomNodeConfigs(state),
  staticNetworks: getStaticNetworkConfigs(state)
});

const mapDispatchToProps: DispatchProps = {
  addCustomNetwork
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomNodeModal);
