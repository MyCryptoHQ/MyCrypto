import React, { Component } from 'react';
import translate from 'translations';
import { getNetworkContracts } from 'selectors/config';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { isValidETHAddress, isValidAbiJson } from 'libs/validators';
import classnames from 'classnames';
import Select from 'react-select';
import { NetworkContract } from 'types/network';
import { donationAddressMap } from 'config';

interface ContractOption {
  name: string;
  value: string;
}

interface StateProps {
  contracts: NetworkContract[];
}

interface OwnProps {
  accessContract(contractAbi: string, address: string): (ev) => void;
  resetState(): void;
}

type Props = OwnProps & StateProps;

interface State {
  address: string;
  abiJson: string;
  contract: ContractOption | null;
  contractPlaceholder: string;
}

const abiJsonPlaceholder = [
  {
    type: 'constructor',
    inputs: [{ name: 'param1', type: 'uint256', indexed: true }],
    name: 'Event'
  },
  { type: 'function', inputs: [{ name: 'a', type: 'uint256' }], name: 'foo', outputs: [] }
];

class InteractForm extends Component<Props, State> {
  private abiJsonPlaceholder = JSON.stringify(abiJsonPlaceholder, null, 0);

  constructor(props) {
    super(props);
    this.state = {
      address: '',
      abiJson: '',
      contract: null,
      contractPlaceholder: this.isContractsValid()
        ? 'Please select a contract...'
        : 'No contracts available'
    };
  }

  public isContractsValid = () => {
    const { contracts } = this.props;
    return contracts && contracts.length;
  };

  public render() {
    const { contracts, accessContract } = this.props;
    const { address, abiJson, contract } = this.state;
    const validEthAddress = isValidETHAddress(address);
    const validAbiJson = isValidAbiJson(abiJson);
    const showContractAccessButton = validEthAddress && validAbiJson;
    let contractOptions: ContractOption[] = [];

    if (this.isContractsValid()) {
      contractOptions = contracts.map(con => {
        const addr = con.address ? `(${con.address.substr(0, 10)}...)` : '';
        return {
          name: `${con.name} ${addr}`,
          value: this.makeContractValue(con)
        };
      });
    }

    // TODO: Use common components for address, abi json
    return (
      <div className="InteractForm">
        <div className="InteractForm-address row">
          <label className="InteractForm-address-field form-group col-sm-6">
            <h4>{translate('CONTRACT_Title')}</h4>
            <input
              placeholder={`ensdomain.eth or ${donationAddressMap.ETH}`}
              name="contract_address"
              autoComplete="off"
              value={address}
              className={classnames('InteractForm-address-field-input', 'form-control', {
                'is-invalid': !validEthAddress
              })}
              onChange={this.handleInput('address')}
            />
          </label>

          <label className="InteractForm-address-contract form-group col-sm-6">
            <h4>{translate('CONTRACT_Title_2')}</h4>
            <Select
              name="interactContract"
              className={`${!contract ? 'is-invalid' : ''}`}
              value={contract as any}
              placeholder={this.state.contractPlaceholder}
              onChange={this.handleSelectContract}
              options={contractOptions}
              clearable={false}
              searchable={false}
              labelKey="name"
            />
          </label>
        </div>

        <div className="InteractForm-interface">
          <label className="InteractForm-interface-field form-group">
            <h4 className="InteractForm-interface-field-label">{translate('CONTRACT_Json')}</h4>
            <textarea
              placeholder={this.abiJsonPlaceholder}
              name="abiJson"
              className={classnames('InteractForm-interface-field-input', 'form-control', {
                'is-invalid': !validAbiJson
              })}
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

  private handleInput = name => (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.props.resetState();
    this.setState({ [name]: ev.currentTarget.value });
  };

  private handleSelectContract = (contract: ContractOption) => {
    this.props.resetState();
    const fullContract = this.props.contracts.find(currContract => {
      return this.makeContractValue(currContract) === contract.value;
    });

    this.setState({
      address: fullContract && fullContract.address ? fullContract.address : '',
      abiJson: fullContract && fullContract.abi ? fullContract.abi : '',
      contract
    });
  };

  private makeContractValue(contract: NetworkContract) {
    return `${contract.name}:${contract.address}`;
  }
}

const mapStateToProps = (state: AppState) => ({
  contracts: getNetworkContracts(state) || []
});

export default connect<StateProps, {}>(mapStateToProps)(InteractForm);
