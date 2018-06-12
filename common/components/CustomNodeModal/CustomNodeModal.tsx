import React from 'react';
import Modal, { IButton } from 'components/ui/Modal';
import translate, { translateRaw } from 'translations';
import { CustomNetworkConfig } from 'types/network';
import { CustomNodeConfig } from 'types/node';
import { TAddCustomNetwork, addCustomNetwork, AddCustomNodeAction } from 'actions/config';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import {
  getCustomNetworkConfigs,
  getCustomNodeConfigs,
  getStaticNetworkConfigs
} from 'selectors/config';
import { Input, Dropdown } from 'components/ui';
import './CustomNodeModal.scss';
import { exists, SuccessConfig, FailConfig } from 'mycrypto-eth-exists';

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
  defaultNodes: ((SuccessConfig | FailConfig) & { display: string; index: number })[];
}

type Props = OwnProps & StateProps & DispatchProps;

class CustomNodeModal extends React.Component<Props, State> {
  public INITIAL_STATE: State = {
    name: '',
    url: '',
    network: Object.keys(this.props.staticNetworks)[0],
    customNetworkId: '',
    customNetworkUnit: '',
    customNetworkChainId: '',
    hasAuth: false,
    username: '',
    password: '',
    defaultNodes: []
  };

  public state: State = this.INITIAL_STATE;

  private timer: number | null;

  constructor(props: Props) {
    super(props);
    this.pollForDefaultNodes();
  }

  public componentDidUpdate(prevProps: Props) {
    // Reset state when modal opens
    if (!prevProps.isOpen && prevProps.isOpen !== this.props.isOpen) {
      this.setState(this.INITIAL_STATE);
    }
  }

  public componentWillUnmount() {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
    this.timer = null;
  }

  public render() {
    const { customNetworks, handleClose, staticNetworks, isOpen } = this.props;
    const { network, customNetworkChainId } = this.state;
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

    const nameConflictNode = this.getNameConflictNode();
    const chainidConflictNetwork =
      network === CUSTOM.value && this.getChainIdCollisionNetwork(customNetworkChainId);

    const staticNetwrks = Object.keys(staticNetworks).map(net => {
      return { label: net, value: net };
    });
    const customNetwrks = Object.entries(customNetworks).map(([id, net]) => {
      return { label: net.name + ' (Custom)', value: id };
    });
    const options = [...staticNetwrks, ...customNetwrks, CUSTOM];
    return (
      <Modal
        title={translateRaw('NODE_TITLE')}
        isOpen={isOpen}
        buttons={buttons}
        handleClose={handleClose}
        maxWidth={580}
      >
        {isHttps && <div className="alert alert-warning small">{translate('NODE_WARNING')}</div>}

        {nameConflictNode && (
          <div className="alert alert-warning small">
            {translate('CUSTOM_NODE_NAME_CONFLICT', { $node: nameConflictNode.name })}
          </div>
        )}

        {this.renderDefaultNodeDropdown()}

        <form className="CustomNodeModal">
          <div className="flex-wrapper">
            <label className="col-sm-9 input-group flex-grow-1">
              <div className="input-group-header">{translate('CUSTOM_NODE_NAME')}</div>
              <Input
                isValid={!(this.state.name && invalids.name)}
                type="text"
                placeholder="My Node"
                value={this.state.name}
                onChange={e => this.setState({ name: e.currentTarget.value })}
              />
            </label>
            <label className="col-sm-3 input-group">
              <div className="input-group-header">{translate('CUSTOM_NETWORK')}</div>
              <Dropdown
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
                  isValid={!(this.state.customNetworkId && invalids.customNetworkId)}
                  type="text"
                  placeholder="My Custom Network"
                  value={this.state.customNetworkId}
                  onChange={e => this.setState({ customNetworkId: e.currentTarget.value })}
                />
              </label>
              <label className="col-sm-3 input-group input-group-inline">
                <div className="input-group-header">{translate('CUSTOM_NETWORK_CURRENCY')}</div>
                <Input
                  isValid={!(this.state.customNetworkUnit && invalids.customNetworkUnit)}
                  type="text"
                  placeholder="ETH"
                  value={this.state.customNetworkUnit}
                  onChange={e => this.setState({ customNetworkUnit: e.currentTarget.value })}
                />
              </label>
              <label className="col-sm-3 input-group input-group-inline">
                <div className="input-group-header">{translate('CUSTOM_NETWORK_CHAIN_ID')}</div>
                <Input
                  isValid={!(this.state.customNetworkChainId && invalids.customNetworkChainId)}
                  type="text"
                  placeholder="1"
                  value={this.state.customNetworkChainId}
                  onChange={e => this.setState({ customNetworkChainId: e.currentTarget.value })}
                />
              </label>
            </div>
          )}
          {chainidConflictNetwork && (
            <div className="alert alert-warning small">
              {translate('CUSTOM_NODE_CHAINID_CONFLICT', { $network: chainidConflictNetwork.name })}
            </div>
          )}

          <label className="input-group input-group-inline">
            <div className="input-group-header">{translate('CUSTOM_NETWORK_URL')}</div>
            <Input
              isValid={!(this.state.url && invalids.url)}
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
                  isValid={!(this.state.username && invalids.username)}
                  type="text"
                  value={this.state.username}
                  onChange={e => this.setState({ username: e.currentTarget.value })}
                />
              </label>
              <label className="col-sm-6 input-group input-group-inline">
                <div className="input-group-header">{translate('INPUT_PASSWORD_LABEL')}</div>
                <Input
                  isValid={!(this.state.password && invalids.password)}
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

  private pollForDefaultNodes() {
    const pollingInterval = 3000;
    this.timer = window.setInterval(async () => {
      const results = await exists(
        [
          // tslint:disable-next-line:no-http-string
          { type: 'http', addr: 'http://localhost', port: 8545, timeout: 3000 }
        ],
        { includeDefaults: false }
      );
      if (!this.timer) {
        return;
      }
      this.setState({
        defaultNodes: results.filter(r => r.success).map((r, index) => ({
          ...r,
          display: `${r.addr}:${r.port}`,
          index
        }))
      });
    }, pollingInterval);
  }

  private renderDefaultNodeDropdown() {
    const { defaultNodes } = this.state;
    if (!defaultNodes.length) {
      return null;
    }

    return (
      <label className="col-sm-12 input-group">
        <div className="input-group-header"> {'Default Nodes Found'}</div>
        <Dropdown
          options={this.state.defaultNodes.map(n => ({ label: n.display, value: n.index }))}
          onChange={({ value }: { value: string }) => {
            const result = this.state.defaultNodes.find(d => d.index === +value);
            if (!result) {
              return;
            }
            const { addr, port } = result;
            this.setState({ url: `${addr}:${port}`, name: 'MyDefaultNode' });
          }}
        />
      </label>
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

      // Numeric chain ID
      if (this.getChainIdCollisionNetwork(customNetworkChainId)) {
        invalids.customNetworkChainId = true;
      } else {
        const iChainId = parseInt(customNetworkChainId, 10);
        if (!customNetworkChainId || !iChainId || iChainId < 0) {
          invalids.customNetworkChainId = true;
        }
      }
    }

    return invalids;
  }

  private getChainIdCollisionNetwork(chainId: string) {
    if (!chainId) {
      return false;
    }

    const chainIdInt = parseInt(chainId, 10);
    const allNetworks = [
      ...Object.values(this.props.staticNetworks),
      ...Object.values(this.props.customNetworks)
    ];
    return allNetworks.reduce(
      (collision, network) => (network.chainId === chainIdInt ? network : collision),
      null
    );
  }

  private makeCustomNetworkConfigFromState(): CustomNetworkConfig {
    const similarNetworkConfig = Object.values(this.props.staticNetworks).find(
      n => n.chainId === +this.state.customNetworkChainId
    );
    const dPathFormats = similarNetworkConfig ? similarNetworkConfig.dPathFormats : null;

    return {
      isCustom: true,
      id: this.state.customNetworkChainId,
      name: this.state.customNetworkId,
      unit: this.state.customNetworkUnit,
      chainId: parseInt(this.state.customNetworkChainId, 10),
      dPathFormats
    };
  }

  private makeCustomNodeConfigFromState(): CustomNodeConfig {
    const { network, url, name, username, password } = this.state;

    const networkId =
      network === CUSTOM.value
        ? this.makeCustomNetworkId(this.makeCustomNetworkConfigFromState())
        : network;

    return {
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
  }

  private getNameConflictNode(): CustomNodeConfig | undefined {
    const { customNodes } = this.props;
    const config = this.makeCustomNodeConfigFromState();

    return customNodes[config.id];
  }

  private saveAndAdd = () => {
    const node = this.makeCustomNodeConfigFromState();

    if (this.state.network === CUSTOM.value) {
      const network = this.makeCustomNetworkConfigFromState();

      this.props.addCustomNetwork(network);
    }

    this.props.addCustomNode(node);
  };

  private makeCustomNetworkId(config: CustomNetworkConfig): string {
    return config.chainId.toString();
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
