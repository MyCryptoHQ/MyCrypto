import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bufferToHex } from 'ethereumjs-util';

import translate from 'translations';
import { Data } from 'libs/units';
import { INode } from 'libs/nodes';
import { AppState } from 'features/reducers';
import { configNodesSelectors, configSelectors } from 'features/config';
import { notificationsActions } from 'features/notifications';
import {
  transactionFieldsActions,
  transactionFieldsSelectors,
  transactionMetaActions,
  transactionSelectors
} from 'features/transaction';
import { GenerateTransaction } from 'components/GenerateTransaction';
import { Input, Dropdown } from 'components/ui';
import { Fields } from './components';
import './InteractExplorer.scss';

interface StateProps {
  nodeLib: INode;
  to: AppState['transaction']['fields']['to'];
  dataExists: boolean;
  chainId: number;
}

interface DispatchProps {
  showNotification: notificationsActions.TShowNotification;
  setDataField: transactionFieldsActions.TSetDataField;
  resetTransactionRequested: transactionFieldsActions.TResetTransactionRequested;
  setAsContractInteraction: transactionMetaActions.TSetAsContractInteraction;
  setAsViewAndSend: transactionMetaActions.TSetAsViewAndSend;
}

interface OwnProps {
  contractFunctions: any;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
  inputs: {
    [key: string]: { rawData: string; parsedData: string[] | string };
  };
  outputs: any;
  selectedFunction: null | ContractOption;
}

interface ContractFunction {
  constant: boolean;
  decodeInput: any;
  decodeOutput: any;
  encodeInput: any;
  inputs: any[];
  outputs: any;
}

interface ContractOption {
  contract: ContractFunction;
  name: string;
}

class InteractExplorerClass extends Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    contractFunctions: {}
  };

  public state: State = {
    selectedFunction: null,
    inputs: {},
    outputs: {}
  };

  public componentDidMount() {
    this.props.setAsContractInteraction();
    this.props.resetTransactionRequested();
  }

  public componentWillUnmount() {
    this.props.setAsViewAndSend();
  }

  public render() {
    const { inputs, outputs, selectedFunction } = this.state;
    const contractFunctionsOptions = this.contractOptions();

    const { to } = this.props;

    const generateOrWriteButton = this.props.dataExists ? (
      <GenerateTransaction />
    ) : (
      <button
        className="InteractExplorer-func-submit btn btn-primary"
        onClick={this.handleFunctionSend}
      >
        {translate('CONTRACT_WRITE')}
      </button>
    );

    return (
      <div className="InteractExplorer">
        <div className="input-group-wrapper">
          <label className="input-group">
            <div className="input-group-header">
              {translate('CONTRACT_INTERACT_TITLE')}
              <div className="flex-spacer" />
              <span className="small">{to.raw}</span>
            </div>
            <Dropdown
              name="exploreContract"
              value={selectedFunction as any}
              placeholder={translate('SELECT_A_THING', { $thing: 'function' })}
              onChange={this.handleFunctionSelect}
              options={contractFunctionsOptions}
              clearable={true}
              searchable={true}
              labelKey="name"
              valueKey="contract"
            />
          </label>
        </div>

        {selectedFunction && (
          <div key={selectedFunction.name} className="InteractExplorer-func">
            {/* TODO: Use reusable components with validation */}
            {selectedFunction.contract.inputs.map((input, index) => {
              const { type, name } = input;
              // if name is not supplied to arg, use the index instead
              // since that's what the contract ABI function factory subsitutes for the name
              // if it is undefined
              const parsedName = name === '' ? index : name;

              const inputState = this.state.inputs[parsedName];
              return (
                <div key={parsedName} className="input-group-wrapper InteractExplorer-func-in">
                  <label className="input-group">
                    <div className="input-group-header">
                      {(parsedName === index ? `Input#${parsedName}` : parsedName) + ' ' + type}
                    </div>
                    {type === 'bool' ? (
                      <Dropdown
                        options={[{ value: false, label: 'false' }, { value: true, label: 'true' }]}
                        value={
                          inputState
                            ? {
                                label: inputState.rawData,
                                value: inputState.parsedData as any
                              }
                            : undefined
                        }
                        clearable={false}
                        onChange={({ value }: { value: boolean }) => {
                          this.handleBooleanDropdownChange({ value, name: parsedName });
                        }}
                      />
                    ) : (
                      <Input
                        className="InteractExplorer-func-in-input"
                        isValid={!!(inputs[parsedName] && inputs[parsedName].rawData)}
                        name={parsedName}
                        value={(inputs[parsedName] && inputs[parsedName].rawData) || ''}
                        onChange={this.handleInputChange}
                      />
                    )}
                  </label>
                </div>
              );
            })}
            {selectedFunction.contract.outputs.map((output: any, index: number) => {
              const { type, name } = output;
              const parsedName = name === '' ? index : name;
              const o = outputs[parsedName];
              const rawFieldValue = o === null || o === undefined ? '' : o;
              const decodedFieldValue = Buffer.isBuffer(rawFieldValue)
                ? bufferToHex(rawFieldValue)
                : rawFieldValue;

              return (
                <div key={parsedName} className="input-group-wrapper InteractExplorer-func-out">
                  <label className="input-group">
                    <div className="input-group-header"> ↳ {name + ' ' + type}</div>
                    <Input
                      className="InteractExplorer-func-out-input"
                      isValid={!!decodedFieldValue}
                      value={decodedFieldValue}
                      disabled={true}
                    />
                  </label>
                </div>
              );
            })}

            {selectedFunction.contract.constant ? (
              <button
                className="InteractExplorer-func-submit btn btn-primary"
                onClick={this.handleFunctionCall}
              >
                {translate('CONTRACT_READ')}
              </button>
            ) : (
              <React.Fragment>
                <Fields button={generateOrWriteButton} />
              </React.Fragment>
            )}
          </div>
        )}
      </div>
    );
  }

  private contractOptions = () => {
    const { contractFunctions } = this.props;
    const transformedContractFunction: ContractOption[] = Object.keys(contractFunctions).map(
      contractFunction => {
        const contract = contractFunctions[contractFunction];
        return {
          name: contractFunction,
          contract
        };
      }
    );
    return transformedContractFunction;
  };

  private handleFunctionCall = async (_: React.FormEvent<HTMLButtonElement>) => {
    try {
      const data = this.encodeData();
      const { nodeLib, to, chainId } = this.props;
      const { selectedFunction } = this.state;

      if (!to.value) {
        throw Error();
      }

      const callData = { to: to.raw, data };
      const results = await nodeLib.sendCallRequest(callData);

      const parsedResult = selectedFunction!.contract.decodeOutput(results, chainId);

      this.setState({ outputs: parsedResult });
    } catch (e) {
      this.props.showNotification(
        'warning',
        `Function call error: ${(e as Error).message}` || 'Invalid input parameters',
        5000
      );
    }
  };

  private handleFunctionSend = (_: React.FormEvent<HTMLButtonElement>) => {
    try {
      const data = this.encodeData();
      this.props.setDataField({ raw: data, value: Data(data) });
    } catch (e) {
      this.props.showNotification(
        'danger',
        `Function send error: ${(e as Error).message}` || 'Invalid input parameters',
        5000
      );
    }
  };

  private handleFunctionSelect = (selectedFunction: ContractOption) => {
    this.setState({
      selectedFunction,
      outputs: {},
      inputs: {}
    });
  };

  private encodeData(): string {
    const { selectedFunction, inputs } = this.state;
    const parsedInputs = Object.keys(inputs).reduce(
      (accu, key) => ({ ...accu, [key]: inputs[key].parsedData }),
      {}
    );
    return selectedFunction!.contract.encodeInput(parsedInputs);
  }

  private tryParseJSON(input: string) {
    try {
      return JSON.parse(input);
    } catch {
      return input;
    }
  }

  private handleBooleanDropdownChange = ({ value, name }: { value: boolean; name: string }) => {
    this.setState({
      inputs: {
        ...this.state.inputs,
        [name as any]: {
          rawData: value.toString(),
          parsedData: value
        }
      }
    });
  };
  private handleInputChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const rawValue: string = ev.currentTarget.value;
    const isArr = rawValue.startsWith('[') && rawValue.endsWith(']');

    const value = {
      rawData: rawValue,
      parsedData: isArr ? this.tryParseJSON(rawValue) : rawValue
    };
    this.setState({
      inputs: {
        ...this.state.inputs,
        [ev.currentTarget.name]: value
      }
    });
  };
}

export const InteractExplorer = connect(
  (state: AppState) => ({
    nodeLib: configNodesSelectors.getNodeLib(state),
    to: transactionFieldsSelectors.getTo(state),
    dataExists: transactionSelectors.getDataExists(state),
    chainId: configSelectors.getNetworkChainId(state)
  }),
  {
    showNotification: notificationsActions.showNotification,
    setDataField: transactionFieldsActions.setDataField,
    resetTransactionRequested: transactionFieldsActions.resetTransactionRequested,
    setAsContractInteraction: transactionMetaActions.setAsContractInteraction,
    setAsViewAndSend: transactionMetaActions.setAsViewAndSend
  }
)(InteractExplorerClass);
