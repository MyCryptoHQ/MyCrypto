import React from 'react';
import Modal, { IButton } from 'components/ui/Modal';
import translate from 'translations';
import { NETWORKS } from 'config/data';

interface Props {
  handleClose(): void;
}

interface State {
  name: string;
  url: string;
  port: string;
  network: string;
  hasAuth: boolean;
  username: string;
  password: string;
  customEip155: boolean;
  customChainId: string;
}

interface Input {
  name: string;
  label: any;
  placeholder: string;
}

export default class CustomNodeModal extends React.Component<Props, State> {
  public state: State = {
    name: '',
    url: '',
    port: '',
    network: '',
    customEip155: false,
    customChainId: '',
    hasAuth: false,
    username: '',
    password: '',
  };

  public render() {
    const { handleClose } = this.props;
    const isHttps = window.location.protocol.includes('https');

    const buttons: IButton[] = [{
      type: 'primary',
      text: translate('NODE_CTA'),
      onClick: () => console.log("yo")
    }, {
      text: translate('x_Cancel'),
      onClick: handleClose
    }];

    return (
      <Modal
        title={translate('NODE_Title')}
        isOpen={true}
        buttons={buttons}
        handleClose={handleClose}
      >
        <div>
          {isHttps &&
            <div className="alert alert-danger small">
              {translate('NODE_Warning')}
            </div>
          }

          <form>
            <div className="row">
              <div className="col-sm-7">
                <label>{translate('NODE_Name')}</label>
                <input
                  className="form-control"
                  name="name"
                  value={this.state.name}
                  placeholder="My Node"
                  onChange={this.handleChange}
                />
              </div>
              <div className="col-sm-5">
                <label>Network</label>
                <select
                  className="form-control"
                  name="network"
                  value={this.state.network}
                  onChange={this.handleChange}
                >
                  {Object.keys(NETWORKS).map((net) =>
                    <option key={net} value={net}>{net}</option>
                  )}
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            {this.state.network === "custom" &&
              <div className="row">
                <div className="col-sm-7">
                  {this.state.customEip155 &&
                    <input
                      className="form-control"
                      type="number"
                      name="customChainId"
                      value={this.state.customChainId}
                      onChange={this.handleChange}
                      placeholder="Chain ID"
                    />
                  }
                </div>
                <div className="col-sm-5">
                  <label>
                    <input
                      type="checkbox"
                      name="customEip155"
                      checked={this.state.customEip155}
                      onChange={this.handleCheckbox}
                    />
                    {' '}
                    <span>Supports EIP-155</span>
                  </label>
                </div>
              </div>
            }

            <div className="row">
              <div className="col-sm-9">
                <label>URL</label>
                <input
                  className="form-control"
                  name="url"
                  value={this.state.url}
                  placeholder="http://127.0.0.1/"
                  onChange={this.handleChange}
                />
              </div>

              <div className="col-sm-3">
                <label>{translate('NODE_Port')}</label>
                <input
                  className="form-control"
                  name="port"
                  type="number"
                  value={this.state.port}
                  placeholder="8545"
                  onChange={this.handleChange}
                />
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
                  />
                  {' '}
                  <span>HTTP Basic Authentication</span>
                </label>
              </div>
            </div>
            {this.state.hasAuth &&
              <div className="row">
                <div className="col-sm-6">
                  <label>Username</label>
                  <input
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-sm-6">
                  <label>Password</label>
                  <input
                    className="form-control"
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            }
          </form>
        </div>
      </Modal>
    );
  }

  private handleChange = (ev: React.SyntheticEvent<
    HTMLInputElement | HTMLSelectElement
  >) => {
    // TODO: typescript bug: https://github.com/Microsoft/TypeScript/issues/13948
    const name: any = (ev.target as HTMLInputElement).name;
    const value = (ev.target as HTMLInputElement).value;
    this.setState({ [name]: value });
  };

  private handleCheckbox = (ev: React.SyntheticEvent<HTMLInputElement>) => {
    // TODO: typescript bug: https://github.com/Microsoft/TypeScript/issues/13948
    const name: any = (ev.target as HTMLInputElement).name;
    this.setState({ [name]: !this.state[name] });
  };
}
