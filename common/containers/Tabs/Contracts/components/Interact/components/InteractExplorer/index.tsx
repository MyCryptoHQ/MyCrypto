import React, { Component } from 'react';
import translate from 'translations';
import './InteractExplorer.scss';
import { TShowNotification, showNotification } from 'actions/notifications';
import { getNodeLib } from 'selectors/config';
import { getTo, getDataExists } from 'selectors/transaction';
import { INode } from 'libs/nodes/INode';
import { GenerateTransaction } from 'components/GenerateTransaction';
import { AppState } from 'reducers';
import { connect } from 'react-redux';
import { Fields } from './components';
import { setDataField, TSetDataField } from 'actions/transaction';
import { Data } from 'libs/units';

interface StateProps {
  nodeLib: INode;
  to: AppState['transaction']['fields']['to'];
  dataExists: boolean;
}
interface DispatchProps {
  showNotification: TShowNotification;
  setDataField: TSetDataField;
}
interface OwnProps {
  contractFunctions: any;
}
type Props = StateProps & DispatchProps & OwnProps;

interface State {
  inputs: {
    [key: string]: { rawData: string; parsedData: string[] | string };
  };
  outputs;
  selectedFunction: null | any;
  selectedFunctionName: string;
}

class InteractExplorerClass extends Component<Props, State> {
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
    const { inputs, outputs, selectedFunction, selectedFunctionName } = this.state;

    const { to } = this.props;
    const generateOrWriteButton = this.props.dataExists ? (
      <GenerateTransaction />
    ) : (
      <button
        className="InteractExplorer-func-submit btn btn-primary"
        onClick={this.handleFunctionSend}
      >
        {translate('CONTRACT_Write')}
      </button>
    );
    return (
      <div className="InteractExplorer">
        <h3 className="InteractExplorer-title">
          {translate('CONTRACT_Interact_Title')}
          <span className="InteractExplorer-title-address">{to.raw}</span>
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
                <label key={name} className="InteractExplorer-func-in form-group">
                  <h4 className="InteractExplorer-func-in-label">
                    {name}
                    <span className="InteractExplorer-func-in-label-type">{type}</span>
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
                <label key={parsedName} className="InteractExplorer-func-out form-group">
                  <h4 className="InteractExplorer-func-out-label">
                    ↳ {name}
                    <span className="InteractExplorer-func-out-label-type">{type}</span>
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

    return Object.keys(contractFunctions).map(name => {
      return (
        <option key={name} value={name}>
          {name}
        </option>
      );
    });
  };

  private handleFunctionCall = async (_: React.FormEvent<HTMLButtonElement>) => {
    try {
      const data = this.encodeData();
      const { nodeLib, to } = this.props;
      const { selectedFunction } = this.state;

      if (!to.value) {
        throw Error();
      }

      const callData = { to: to.raw, data };
      const results = await nodeLib.sendCallRequest(callData);

      const parsedResult = selectedFunction.decodeOutput(results);
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

  private handleFunctionSelect = (ev: React.FormEvent<HTMLSelectElement>) => {
    const { contractFunctions } = this.props;
    const selectedFunctionName = ev.currentTarget.value;
    const selectedFunction = contractFunctions[selectedFunctionName];

    this.setState({
      selectedFunction,
      selectedFunctionName,
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
    const data = selectedFunction.encodeInput(parsedInputs);
    return data;
  }

  private tryParseJSON(input: string) {
    try {
      return JSON.parse(input);
    } catch {
      return input;
    }
  }

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
    nodeLib: getNodeLib(state),
    to: getTo(state),
    dataExists: getDataExists(state)
  }),
  { showNotification, setDataField }
)(InteractExplorerClass);
