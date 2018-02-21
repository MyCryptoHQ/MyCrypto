import React from 'react';
import classnames from 'classnames';
import Modal, { IButton } from 'components/ui/Modal';
import translate from 'translations';
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

const CUSTOM = 'custom';

interface Input {
  name: string;
  placeholder?: string;
  type?: string;
  autoComplete?: 'off';
  onFocus?(): void;
  onBlur?(): void;
}

interface OwnProps {
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
  public state: State = {
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

  public render() {
    const { customNetworks, handleClose, staticNetworks } = this.props;
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
        text: translate('x_Cancel'),
        onClick: handleClose
      }
    ];

    const conflictedNode = this.getConflictedNode();

    return (
      <Modal
        title={translate('NODE_Title')}
        isOpen={true}
        buttons={buttons}
        handleClose={handleClose}
        maxWidth={580}
      >
        <div>
          {isHttps && <div className="alert alert-warning small">{translate('NODE_Warning')}</div>}

          {conflictedNode && (
            <div className="alert alert-warning small">
              You already have a node called '{conflictedNode.name}' that matches this one, saving
              this will overwrite it
            </div>
          )}

          <form>
            <div className="row">
              <div className="col-sm-7">
                <label>{translate('NODE_Name')}</label>
                {this.renderInput(
                  {
                    name: 'name',
                    placeholder: 'My Node'
                  },
                  invalids
                )}
              </div>
              <div className="col-sm-5">
                <label>Network</label>
                <select
                  className="form-control"
                  name="network"
                  value={network}
                  onChange={this.handleChange}
                >
                  {Object.keys(staticNetworks).map(net => (
                    <option key={net} value={net}>
                      {net}
                    </option>
                  ))}
                  {Object.entries(customNetworks).map(([id, net]) => (
                    <option key={id} value={id}>
                      {net.name} (Custom)
                    </option>
                  ))}
                  <option value={CUSTOM}>Custom...</option>
                </select>
              </div>
            </div>

            {network === CUSTOM && (
              <div className="row">
                <div className="col-sm-6">
                  <label className="is-required">Network Name</label>
                  {this.renderInput(
                    {
                      name: 'customNetworkId',
                      placeholder: 'My Custom Network'
                    },
                    invalids
                  )}
                </div>
                <div className="col-sm-3">
                  <label className="is-required">Currency</label>
                  {this.renderInput(
                    {
                      name: 'customNetworkUnit',
                      placeholder: 'ETH'
                    },
                    invalids
                  )}
                </div>
                <div className="col-sm-3">
                  <label>Chain ID</label>
                  {this.renderInput(
                    {
                      name: 'customNetworkChainId',
                      placeholder: 'e.g. 1'
                    },
                    invalids
                  )}
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-sm-12">
                <label>URL</label>
                {this.renderInput(
                  {
                    name: 'url',
                    placeholder: 'e.g. https://127.0.0.1:8545/',
                    autoComplete: 'off'
                  },
                  invalids
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <label>
                  <input
                    type="checkbox"
                    name="hasAuth"
                    checked={this.state.hasAuth}
                    onChange={this.handleCheckbox}
                  />{' '}
                  <span>HTTP Basic Authentication</span>
                </label>
              </div>
            </div>
            {this.state.hasAuth && (
              <div className="row">
                <div className="col-sm-6">
                  <label className="is-required">Username</label>
                  {this.renderInput({ name: 'username' }, invalids)}
                </div>
                <div className="col-sm-6">
                  <label className="is-required">Password</label>
                  {this.renderInput(
                    {
                      name: 'password',
                      type: 'password'
                    },
                    invalids
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </Modal>
    );
  }

  private renderInput(input: Input, invalids: { [key: string]: boolean }) {
    return (
      <input
        className={classnames({
          'form-control': true,
          'is-invalid': this.state[input.name] && invalids[input.name]
        })}
        value={this.state[input.name]}
        onChange={this.handleChange}
        autoComplete="off"
        {...input}
      />
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
    if (network === CUSTOM) {
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
      network === CUSTOM
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

  private handleChange = (ev: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = ev.currentTarget;
    this.setState({ [name as any]: value });
  };

  private handleCheckbox = (ev: React.FormEvent<HTMLInputElement>) => {
    const { name } = ev.currentTarget;
    this.setState({ [name as any]: !this.state[name as keyof State] });
  };

  private saveAndAdd = () => {
    const node = this.makeCustomNodeConfigFromState();

    if (this.state.network === CUSTOM) {
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
