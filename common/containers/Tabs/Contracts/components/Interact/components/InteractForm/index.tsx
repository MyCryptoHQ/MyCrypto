import React, { Component } from 'react';
import translate from 'translations';
import './InteractForm.scss';
import { NetworkContract } from 'config/data';
import { getNetworkContracts } from 'selectors/config';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { isValidETHAddress, isValidAbiJson } from 'libs/validators';
import classnames from 'classnames';

interface Props {
  contracts: NetworkContract[];
  accessContract(abiJson: string, address: string): (ev) => void;
  resetState(): void;
}

interface State {
  address: string;
  abiJson: string;
}

class InteractForm extends Component<Props, State> {
  public state = {
    address: '',
    abiJson: ''
  };

  private abiJsonPlaceholder = '[{ "type":"contructor", "inputs":\
 [{ "name":"param1","type":"uint256", "indexed":true }],\
"name":"Event" }, { "type":"function", "inputs": [{"nam\
e":"a", "type":"uint256"}], "name":"foo", "outputs": [] }]';

  public render() {
    const { contracts, accessContract } = this.props;
    const { address, abiJson } = this.state;
    const validEthAddress = isValidETHAddress(address);
    const validAbiJson = isValidAbiJson(abiJson);
    const showContractAccessButton = validEthAddress && validAbiJson;
    let contractOptions;
    if (contracts && contracts.length) {
      contractOptions = [
        {
          name: 'Select a contract...',
          value: null
        }
      ];

      contractOptions = contractOptions.concat(
        contracts.map(contract => {
          return {
            name: `${contract.name} (${contract.address.substr(0, 10)}...)`,
            value: contract.address
          };
        })
      );
    } else {
      contractOptions = [
        {
          name: 'No contracts available',
          value: null
        }
      ];
    }

    // TODO: Use common components for address, abi json
    return (
      <div className="InteractForm">
        <div className="InteractForm-address">
          <label className="InteractForm-address-field form-group">
            <h4>{translate('CONTRACT_Title')}</h4>
            <input
              placeholder="mewtopia.eth or 0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8"
              name="contract_address"
              autoComplete="off"
              value={address}
              className={classnames(
                'InteractForm-address-field-input',
                'form-control',
                {
                  'is-invalid': !validEthAddress
                }
              )}
              onChange={this.handleInput('address')}
            />
          </label>

          <label className="InteractForm-address-contract form-group">
            <h4>{translate('CONTRACT_Title_2')}</h4>
            <select
              className="InteractForm-address-field-input form-control"
              onChange={this.handleSelectContract}
              disabled={!contracts || !contracts.length}
            >
              {contractOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="InteractForm-interface">
          <label className="InteractForm-interface-field form-group">
            <h4 className="InteractForm-interface-field-label">
              {translate('CONTRACT_Json')}
            </h4>
            <textarea
              placeholder={this.abiJsonPlaceholder}
              name="abiJson"
              className={classnames(
                'InteractForm-interface-field-input',
                'form-control',
                {
                  'is-invalid': !validAbiJson
                }
              )}
              onChange={this.handleInput('abiJson')}
              value={abiJson}
              rows={6}
            />
          </label>
        </div>

        <button
          className="InteractForm-submit btn btn-primary"
          disabled={!showContractAccessButton}
          onClick={accessContract(abiJson, address)}
        >
          {translate('x_Access')}
        </button>
      </div>
    );
  }

  private handleInput = name => (ev: any) => {
    this.props.resetState();
    this.setState({ [name]: ev.target.value });
  };

  private handleSelectContract = (ev: any) => {
    this.props.resetState();
    const addr = ev.target.value;
    const contract = this.props.contracts.reduce((prev, currContract) => {
      return currContract.address === addr ? currContract : prev;
    });

    this.setState({
      address: contract.address,
      abiJson: contract.abi
    });
  };
}

const mapStateToProps = (state: AppState) => ({
  contracts: getNetworkContracts(state)
});

export default connect(mapStateToProps)(InteractForm);
