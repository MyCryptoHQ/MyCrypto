import React, { Component } from 'react';
import translate from 'translations';
import './InteractForm.scss';
import { NetworkContract } from 'config/data';
import { getNetworkContracts } from 'selectors/config';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
interface Props {
  contracts: NetworkContract[];
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

  public render() {
    const { contracts } = this.props;
    const { address, abiJson } = this.state;

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
              name="address"
              value={address}
              className="InteractForm-address-field-input form-control"
              onChange={this.handleInput}
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
              placeholder="[{ &quot;type&quot;:&quot;contructor&quot;, &quot;inputs&quot;: [{ &quot;name&quot;:&quot;param1&quot;, &quot;type&quot;:&quot;uint256&quot;, &quot;indexed&quot;:true }], &quot;name&quot;:&quot;Event&quot; }, { &quot;type&quot;:&quot;function&quot;, &quot;inputs&quot;: [{&quot;name&quot;:&quot;a&quot;, &quot;type&quot;:&quot;uint256&quot;}], &quot;name&quot;:&quot;foo&quot;, &quot;outputs&quot;: [] }] "
              name="abiJson"
              className="InteractForm-interface-field-input form-control"
              onChange={this.handleInput}
              value={abiJson}
              rows={6}
            />
          </label>
        </div>

        <button
          className="InteractForm-submit btn btn-primary"
          onClick={this.accessContract}
        >
          {translate('x_Access')}
        </button>
      </div>
    );
  }

  private handleInput = (ev: any) => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  private handleSelectContract = (ev: any) => {
    const addr = ev.target.value;
    const contract = this.props.contracts.reduce((prev, currContract) => {
      return currContract.address === addr ? currContract : prev;
    });

    this.setState({
      address: contract.address,
      abiJson: contract.abi
    });
  };

  private accessContract = () => {
    this.props.accessContract(this.state.address, this.state.abiJson);
  };
}
const mapStateToProps = (state: AppState) => ({
  contracts: getNetworkContracts(state)
});

export default connect(mapStateToProps)(InteractForm);
