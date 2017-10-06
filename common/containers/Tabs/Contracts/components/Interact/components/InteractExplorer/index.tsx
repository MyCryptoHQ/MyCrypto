import React, { Component } from 'react';
import translate from 'translations';
import './InteractExplorer.scss';
import Contract from 'libs/contracts';
interface Props {
  contractFunctions: any;
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
            {Object.keys(selectedFunction.funcParams).map(input => {
              const { type, name } = selectedFunction.funcParams[input];

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

            {selectedFunction.constant ? (
              <button
                className="InteractExplorer-func-submit btn btn-primary"
                onClick={() => {
                  selectedFunction.call(inputs).then(x => console.log(x));
                }}
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

  private handleFunctionSelect = (ev: any) => {
    const { contractFunctions } = this.props;

    const selectedFunctionName = ev.target.value;
    const selectedFunction = contractFunctions[selectedFunctionName];
    this.setState({
      selectedFunction,
      selectedFunctionName
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

/*
 *          {selectedFunction.outputs.map(output => (
              <label
                key={output.name}
                className="InteractExplorer-func-out form-group"
              >
                <h4 className="InteractExplorer-func-out-label">
                  ↳ {output.name}
                  <span className="InteractExplorer-func-out-label-type">
                    {output.type}
                  </span>
                </h4>
                <input
                  className="InteractExplorer-func-out-input form-control"
                  value={outputs[output.name]}
                  disabled={true}
                />
              </label>
            ))}
 *
 */
