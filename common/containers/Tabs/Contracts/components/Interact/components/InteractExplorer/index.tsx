import React, { Component } from 'react';
import translate from 'translations';
import './InteractExplorer.scss';
import Contract from 'libs/contracts';
import { IUserSendParams } from 'libs/contracts/ABIFunction';
import { TDeployModal } from 'containers/Tabs/Contracts/components/TxModal';
import WalletDecrypt from 'components/WalletDecrypt';

interface Props {
  contractFunctions: any;
  //DeployModal: TDeployModal | null;

  address: Contract['address'];
}

interface State {
  inputs;
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

  public contractOptions = () => {
    const { contractFunctions } = this.props;

    return Object.keys(contractFunctions).map(name => {
      return (
        <option key={name} value={name}>
          {name}
        </option>
      );
    });
  };

  public render() {
    const {
      inputs,
      outputs,
      selectedFunction,
      selectedFunctionName
    } = this.state;
    const { contractFunctions, address } = this.props;

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
                    value={inputs[name] || ''}
                    onChange={this.handleInputChange}
                  />
                </label>
              );
            })}
            {selectedFunction.outputs.map(output => {
              const { type, name } = output;
              return (
                <label
                  key={name}
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
                    value={outputs[name] || ''}
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
              <button className="InteractExplorer-func-submit btn btn-primary">
                {translate('CONTRACT_Write')}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
  private handleFunctionCall = async (ev: any) => {
    const { selectedFunction, inputs } = this.state;
    const results = await selectedFunction.call(inputs);
    this.setState({ outputs: results });
  };
  private handleFunctionSend = (ev: any) => {
    const { selectedFunction, inputs } = this.state;

    const userInputs: IUserSendParams = {
      input: inputs,
      to: this.props.address,
      gasLimit: this.state.gas,
      value
    };
    selectedFunction.send(inputs);
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

  private handleInputChange = (ev: any) => {
    this.setState({
      inputs: {
        ...this.state.inputs,
        [ev.target.name]: ev.target.value
      }
    });
  };
}
