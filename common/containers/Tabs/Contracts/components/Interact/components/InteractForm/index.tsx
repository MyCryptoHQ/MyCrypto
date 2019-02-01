import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addHexPrefix } from 'ethereumjs-util';

import { donationAddressMap } from 'config';
import translate, { translateRaw } from 'translations';
import { NetworkContract } from 'types/network';
import { isValidAbiJson } from 'libs/validators';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { configSelectors } from 'features/config';
import { setCurrentTo, TSetCurrentTo } from 'features/transaction/actions';
import { Input, TextArea, CodeBlock, Dropdown } from 'components/ui';
import { AddressFieldFactory } from 'components/AddressFieldFactory';

interface ContractOption {
  name: string;
  value: string;
}

interface StateProps {
  currentTo: ReturnType<typeof selectors.getCurrentTo>;
  contracts: NetworkContract[];
  isValidAddress: ReturnType<typeof configSelectors.getIsValidAddressFn>;
}

interface OwnProps {
  accessContract(contractAbi: string): (ev: any) => void;
  resetState(): void;
}

interface DispatchProps {
  setCurrentTo: TSetCurrentTo;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
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
      abiJson: '',
      contract: null,
      contractPlaceholder: this.isContractsValid()
        ? translateRaw('SELECT_A_THING', { $thing: 'contract' })
        : translateRaw('NO_CONTRACTS_AVAILABLE')
    };
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const prevProps = this.props;
    if (nextProps.currentTo.raw !== prevProps.currentTo.raw) {
      nextProps.resetState();
    }
  }

  public isContractsValid = () => {
    const { contracts } = this.props;
    return contracts && contracts.length;
  };

  public render() {
    const { contracts, accessContract, currentTo, isValidAddress } = this.props;
    const { abiJson, contract } = this.state;
    const validEthAddress = isValidAddress(
      currentTo.value ? addHexPrefix(currentTo.value.toString('hex')) : ''
    );
    const validAbiJson = isValidAbiJson(abiJson);
    const showContractAccessButton = validEthAddress && validAbiJson;
    let options: ContractOption[] = [];

    if (this.isContractsValid()) {
      const contractOptions = contracts.map(con => {
        const addr = con.address ? `(${con.address.substr(0, 10)}...)` : '';
        return {
          name: `${con.name} ${addr}`,
          value: this.makeContractValue(con)
        };
      });
      options = [{ name: 'Custom', value: '' }, ...contractOptions];
    }

    // TODO: Use common components for abi json
    return (
      <div className="InteractForm">
        <div className="InteractForm-address row">
          <div className="input-group-wrapper InteractForm-address-field col-sm-6">
            <label className="input-group">
              <div className="input-group-header">{translate('CONTRACT_TITLE_2')}</div>
              <Dropdown
                className={`${!contract ? 'invalid' : ''}`}
                value={contract as any}
                placeholder={this.state.contractPlaceholder}
                onChange={this.handleSelectContract}
                options={options}
                searchable={true}
                clearable={true}
                labelKey="name"
              />
            </label>
          </div>

          <div className="input-group-wrapper InteractForm-address-field col-sm-6">
            <AddressFieldFactory
              withProps={({ isValid, onChange }) => (
                <label className="input-group">
                  <div className="input-group-header">{translate('CONTRACT_TITLE')}</div>
                  <Input
                    placeholder={`ensdomain.eth or ${donationAddressMap.ETH}`}
                    name="contract_address"
                    autoComplete="off"
                    value={currentTo.raw}
                    isValid={isValid}
                    className="InteractForm-address-field-input"
                    spellCheck={false}
                    onChange={onChange}
                  />
                </label>
              )}
            />
          </div>
        </div>

        <label className="input-group">
          <div className="input-group-header">{translate('CONTRACT_JSON')}</div>
          {!!contract ? (
            contract.name === 'Custom' ? (
              <TextArea
                placeholder={this.abiJsonPlaceholder}
                isValid={!!validAbiJson}
                className="InteractForm-interface-field-input"
                onChange={this.handleInput('abiJson')}
                value={abiJson}
                rows={6}
              />
            ) : (
              <CodeBlock className="wrap">{abiJson}</CodeBlock>
            )
          ) : (
            <TextArea
              placeholder={this.abiJsonPlaceholder}
              isValid={!!validAbiJson}
              className="InteractForm-interface-field-input"
              onChange={this.handleInput('abiJson')}
              value={abiJson}
              rows={6}
            />
          )}
        </label>

        <button
          className="InteractForm-submit btn btn-primary"
          disabled={!showContractAccessButton}
          onClick={accessContract(abiJson)}
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
    this.setState({ [name]: ev.currentTarget.value } as any);
  };

  private handleSelectContract = (contract: ContractOption) => {
    this.props.resetState();
    const fullContract = this.props.contracts.find(currContract => {
      return contract && this.makeContractValue(currContract) === contract.value;
    });

    if (fullContract) {
      this.props.setCurrentTo(fullContract.address || '');
      this.setState({
        abiJson: fullContract.abi || '',
        contract
      });
    } else {
      this.props.setCurrentTo('');
      this.setState({
        abiJson: '',
        contract
      });
    }
  };

  private makeContractValue(contract: NetworkContract) {
    return `${contract.name}:${contract.address}`;
  }
}

const mapStateToProps = (state: AppState) => ({
  contracts: configSelectors.getNetworkContracts(state) || [],
  currentTo: selectors.getCurrentTo(state),
  isValidAddress: configSelectors.getIsValidAddressFn(state)
});

export default connect(mapStateToProps, { setCurrentTo })(InteractForm);
