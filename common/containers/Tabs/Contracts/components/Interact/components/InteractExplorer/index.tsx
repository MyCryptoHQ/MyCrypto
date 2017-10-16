import React, { Component } from 'react';
import translate from 'translations';
import './InteractExplorer.scss';
import Contract from 'libs/contracts';
import { TTxModal } from 'containers/Tabs/Contracts/components/TxModal';
import { TTxCompare } from 'containers/Tabs/Contracts/components/TxCompare';
import WalletDecrypt from 'components/WalletDecrypt';
import { TShowNotification } from 'actions/notifications';
import classnames from 'classnames';
import { isValidGasPrice, isValidValue } from 'libs/validators';
import { addProperties } from 'utils/helpers';

export interface Props {
  contractFunctions: any;
  walletDecrypted: boolean;
  address: Contract['address'];
  gasLimit: string;
  value: string;
  txGenerated: boolean;
  txModal: React.ReactElement<TTxModal> | null;
  txCompare: React.ReactElement<TTxCompare> | null;
  displayModal: boolean;
  showNotification: TShowNotification;
  toggleModal(): void;
  handleInput(name: string): (ev) => void;
  handleFunctionSend(selectedFunction, inputs): () => void;
}

interface State {
  inputs: {
    [key: string]: { rawData: string; parsedData: string[] | string };
  };
  outputs;
  selectedFunction: null | any;
  selectedFunctionName: string;
}

export default class InteractExplorer extends Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    contractFunctions: {}
  };

  public state: State = {
    selectedFunction: null,
    selectedFunctionName: '',
    inputs: {},
    outputs: {}
  };

  public render() {
    const {
      inputs,
      outputs,
      selectedFunction,
      selectedFunctionName
    } = this.state;

    const {
      address,
      displayModal,
      handleInput,
      handleFunctionSend,
      gasLimit,
      txGenerated,
      txCompare,
      txModal,
      toggleModal,
      value,
      walletDecrypted
    } = this.props;

    const validValue = isValidValue(value);
    const validGasLimit = isValidGasPrice(gasLimit);
    const showContractWrite = validValue && validGasLimit;
    return (
      <div className="InteractExplorer">
        <h3 className="InteractExplorer-title">
          {translate('CONTRACT_Interact_Title')}
          <span className="InteractExplorer-title-address">{address}</span>
        </h3>

        <select
          value={selectedFunction ? selectedFunction.name : ''}
          className="InteractExplorer-fnselect form-control"
          onChange={this.handleFunctionSelect}
        >
          <option>{translate('CONTRACT_Interact_CTA', true)}</option>
          {this.contractOptions()}
        </select>

        {selectedFunction && (
          <div key={selectedFunctionName} className="InteractExplorer-func">
            {/* TODO: Use reusable components with validation */}
            {selectedFunction.inputs.map(input => {
              const { type, name } = input;

              return (
                <label
                  key={name}
                  className="InteractExplorer-func-in form-group"
                >
                  <h4 className="InteractExplorer-func-in-label">
                    {name}
                    <span className="InteractExplorer-func-in-label-type">
                      {type}
                    </span>
                  </h4>
                  <input
                    className="InteractExplorer-func-in-input form-control"
                    name={name}
                    value={(inputs[name] && inputs[name].rawData) || ''}
                    onChange={this.handleInputChange}
                  />
                </label>
              );
            })}
            {selectedFunction.outputs.map((output, index) => {
              const { type, name } = output;
              const parsedName = name === '' ? index : name;

              return (
                <label
                  key={parsedName}
                  className="InteractExplorer-func-out form-group"
                >
                  <h4 className="InteractExplorer-func-out-label">
                    ↳ {name}
                    <span className="InteractExplorer-func-out-label-type">
                      {type}
                    </span>
                  </h4>
                  <input
                    className="InteractExplorer-func-out-input form-control"
                    value={outputs[parsedName] || ''}
                    disabled={true}
                  />
                </label>
              );
            })}

            {selectedFunction.constant ? (
              <button
                className="InteractExplorer-func-submit btn btn-primary"
                onClick={this.handleFunctionCall}
              >
                {translate('CONTRACT_Read')}
              </button>
            ) : walletDecrypted ? (
              !txGenerated ? (
                <Aux>
                  <label className="InteractExplorer-field form-group">
                    <h4 className="InteractExplorer-field-label">Gas Limit</h4>
                    <input
                      name="gasLimit"
                      value={gasLimit}
                      onChange={handleInput('gasLimit')}
                      className={classnames(
                        'InteractExplorer-field-input',
                        'form-control',
                        { 'is-invalid': !validGasLimit }
                      )}
                    />
                  </label>
                  <label className="InteractExplorer-field form-group">
                    <h4 className="InteractExplorer-field-label">Value</h4>
                    <input
                      name="value"
                      value={value}
                      onChange={handleInput('value')}
                      placeholder="0"
                      className={classnames(
                        'InteractExplorer-field-input',
                        'form-control',
                        { 'is-invalid': !validValue }
                      )}
                    />
                  </label>
                  <button
                    className="InteractExplorer-func-submit btn btn-primary"
                    disabled={!showContractWrite}
                    {...addProperties(showContractWrite, {
                      onClick: handleFunctionSend(selectedFunction, inputs)
                    })}
                  >
                    {translate('CONTRACT_Write')}
                  </button>
                </Aux>
              ) : (
                <Aux>
                  {txCompare}
                  <button
                    className="Deploy-submit btn btn-primary"
                    onClick={toggleModal}
                  >
                    {translate('SEND_trans')}
                  </button>
                </Aux>
              )
            ) : (
              <WalletDecrypt />
            )}
          </div>
        )}
        {displayModal && txModal}
      </div>
    );
  }

  private contractOptions = () => {
    const { contractFunctions } = this.props;

    return Object.keys(contractFunctions).map(name => {
      return (
        <option key={name} value={name}>
          {name}
        </option>
      );
    });
  };

  private handleFunctionCall = async (_: any) => {
    try {
      const { selectedFunction, inputs } = this.state;
      const parsedInputs = Object.keys(inputs).reduce(
        (accu, key) => ({ ...accu, [key]: inputs[key].parsedData }),
        {}
      );
      const results = await selectedFunction.call(parsedInputs);
      this.setState({ outputs: results });
    } catch (e) {
      this.props.showNotification(
        'warning',
        `Function call error: ${(e as Error).message}` ||
          'Invalid input parameters',
        5000
      );
    }
  };

  private handleFunctionSelect = (ev: any) => {
    const { contractFunctions } = this.props;

    const selectedFunctionName = ev.target.value;
    const selectedFunction = contractFunctions[selectedFunctionName];
    this.setState({
      selectedFunction,
      selectedFunctionName,
      outputs: {},
      inputs: {}
    });
  };

  private tryParseJSON(input: string) {
    try {
      return JSON.parse(input);
    } catch {
      return input;
    }
  }

  private handleInputChange = (ev: any) => {
    const rawValue: string = ev.target.value;
    const isArr = rawValue.startsWith('[') && rawValue.endsWith(']');

    const value = {
      rawData: rawValue,
      parsedData: isArr ? this.tryParseJSON(rawValue) : rawValue
    };
    this.setState({
      inputs: {
        ...this.state.inputs,
        [ev.target.name]: value
      }
    });
  };
}
const Aux = ({ children }) => children;
