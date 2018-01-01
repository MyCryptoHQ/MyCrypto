import React from 'react';
import classnames from 'classnames';
import Modal, { IButton } from 'components/ui/Modal';
import translate from 'translations';
import { NETWORKS, CustomNodeConfig, CustomNetworkConfig } from 'config/data';
import { makeCustomNodeId } from 'utils/node';
import { makeCustomNetworkId } from 'utils/network';

const NETWORK_KEYS = Object.keys(NETWORKS);
const CUSTOM = 'custom';

interface Input {
  name: string;
  placeholder?: string;
  type?: string;
}

interface Props {
  customNodes: CustomNodeConfig[];
  customNetworks: CustomNetworkConfig[];
  handleAddCustomNode(node: CustomNodeConfig): void;
  handleAddCustomNetwork(node: CustomNetworkConfig): void;
  handleClose(): void;
}

interface State {
  name: string;
  url: string;
  port: string;
  network: string;
  customNetworkName: string;
  customNetworkUnit: string;
  customNetworkChainId: string;
  hasAuth: boolean;
  username: string;
  password: string;
}

export default class CustomNodeModal extends React.Component<Props, State> {
  public state: State = {
    name: '',
    url: '',
    port: '',
    network: NETWORK_KEYS[0],
    customNetworkName: '',
    customNetworkUnit: '',
    customNetworkChainId: '',
    hasAuth: false,
    username: '',
    password: ''
  };

  public render() {
    const { customNetworks, handleClose } = this.props;
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
                  {NETWORK_KEYS.map(net => (
                    <option key={net} value={net}>
                      {net}
                    </option>
                  ))}
                  {customNetworks.map(net => {
                    const id = makeCustomNetworkId(net);
                    return (
                      <option key={id} value={id}>
                        {net.name} (Custom)
                      </option>
                    );
                  })}
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
                      name: 'customNetworkName',
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

            <hr />

            <div className="row">
              <div className="col-sm-9">
                <label>URL</label>
                {this.renderInput(
                  {
                    name: 'url',
                    placeholder: 'http://127.0.0.1/'
                  },
                  invalids
                )}
              </div>

              <div className="col-sm-3">
                <label>{translate('NODE_Port')}</label>
                {this.renderInput(
                  {
                    name: 'port',
                    placeholder: '8545',
                    type: 'number'
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
        {...input}
      />
    );
  }

  private getInvalids(): { [key: string]: boolean } {
    const {
      url,
      port,
      hasAuth,
      username,
      password,
      network,
      customNetworkName,
      customNetworkUnit,
      customNetworkChainId
    } = this.state;
    const required: (keyof State)[] = ['name', 'url', 'port', 'network'];
    const invalids: { [key: string]: boolean } = {};

    // Required fields
    required.forEach(field => {
      if (!this.state[field]) {
        invalids[field] = true;
      }
    });

    // Somewhat valid URL, not 100% fool-proof
    if (!/https?\:\/\/\w+/i.test(url)) {
      invalids.url = true;
    }

    // Numeric port within range
    const iport = parseInt(port, 10);
    if (!iport || iport < 1 || iport > 65535) {
      invalids.port = true;
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
      if (!customNetworkName) {
        invalids.customNetworkName = true;
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
    return {
      name: this.state.customNetworkName,
      unit: this.state.customNetworkUnit,
      chainId: this.state.customNetworkChainId ? parseInt(this.state.customNetworkChainId, 10) : 0
    };
  }

  private makeCustomNodeConfigFromState(): CustomNodeConfig {
    const { network } = this.state;
    const node: CustomNodeConfig = {
      name: this.state.name.trim(),
      url: this.state.url.trim(),
      port: parseInt(this.state.port, 10),
      network:
        network === CUSTOM ? makeCustomNetworkId(this.makeCustomNetworkConfigFromState()) : network
    };

    if (this.state.hasAuth) {
      node.auth = {
        username: this.state.username,
        password: this.state.password
      };
    }

    return node;
  }

  private getConflictedNode(): CustomNodeConfig | undefined {
    const { customNodes } = this.props;
    const config = this.makeCustomNodeConfigFromState();
    const thisId = makeCustomNodeId(config);
    return customNodes.find(conf => makeCustomNodeId(conf) === thisId);
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
      this.props.handleAddCustomNetwork(network);
    }

    this.props.handleAddCustomNode(node);
  };
}
