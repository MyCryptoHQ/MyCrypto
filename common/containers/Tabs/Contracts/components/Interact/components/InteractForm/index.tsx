import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
import { getNetworkContracts } from 'selectors/config';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { isValidETHAddress, isValidAbiJson } from 'libs/validators';
import classnames from 'classnames';
import { NetworkContract } from 'types/network';
import { donationAddressMap } from 'config';
import { Input, TextArea } from 'components/ui';
import Dropdown from 'components/ui/Dropdown';

interface ContractOption {
  name: string;
  value: string;
}

interface StateProps {
  contracts: NetworkContract[];
}

interface OwnProps {
  accessContract(contractAbi: string, address: string): (ev: any) => void;
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

  constructor(props: Props) {
    super(props);
    this.state = {
      address: '',
      abiJson: '',
      contract: null,
      contractPlaceholder: this.isContractsValid()
        ? translateRaw('SELECT_A_THING', { $thing: 'contract' })
        : translateRaw('NO_CONTRACTS_AVAILABLE')
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
          <div className="input-group-wrapper InteractForm-address-field col-sm-6">
            <label className="input-group">
              <div className="input-group-header">{translate('CONTRACT_TITLE')}</div>
              <Input
                placeholder={`ensdomain.eth or ${donationAddressMap.ETH}`}
                name="contract_address"
                autoComplete="off"
                value={address}
                className={classnames('InteractForm-address-field-input', {
                  invalid: !validEthAddress
                })}
                onChange={this.handleInput('address')}
              />
            </label>
          </div>

          <div className="input-group-wrapper InteractForm-address-field col-sm-6">
            <label className="input-group">
              <div className="input-group-header">{translate('CONTRACT_TITLE_2')}</div>
              <Dropdown
                className={`${!contract ? 'invalid' : ''}`}
                value={contract as any}
                placeholder={this.state.contractPlaceholder}
                onChange={this.handleSelectContract}
                options={contractOptions}
                clearable={false}
                labelKey="name"
              />
            </label>
          </div>
        </div>

        <div className="input-group-wrapper InteractForm-interface">
          <label className="input-group">
            <div className="input-group-header">{translate('CONTRACT_JSON')}</div>
            <TextArea
              placeholder={this.abiJsonPlaceholder}
              className={`InteractForm-interface-field-input ${validAbiJson ? '' : 'invalid'}`}
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
          {translate('X_ACCESS')}
        </button>
      </div>
    );
  }

  private handleInput = (name: any) => (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
