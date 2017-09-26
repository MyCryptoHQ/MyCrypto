import React, { Component } from 'react';
import translate from 'translations';
import { ABIFunction } from 'actions/contracts';
import './InteractExplorer.scss';

interface Props {
  address: string | undefined | null;
  functions: ABIFunction[] | undefined | null;
}

interface State {
  selectedFunction: ABIFunction | undefined | null;
  inputs: object;
  outputs: object;
}

export default class InteractExplorer extends Component<Props, State> {
  public state: State = {
    selectedFunction: null,
    inputs: {},
    outputs: {}
  };

  public _handleFunctionSelect = (ev: any) => {
    const { functions } = this.props;

    if (!functions) {
      return;
    }

    const selectedFunction = functions.reduce((prev, fn) => {
      return ev.target.value === fn.name ? fn : prev;
    });

    this.setState({
      selectedFunction,
      inputs: {}
    });
  };

  public _handleInputChange = (ev: any) => {
    this.setState({
      inputs: {
        ...this.state.inputs,
        [ev.target.name]: ev.target.value
      }
    });
  };

  public render() {
    const { address, functions } = this.props;
    const { selectedFunction, inputs, outputs } = this.state;

    if (!functions) {
      return null;
    }

    return (
      <div className="InteractExplorer">
        <h3 className="InteractExplorer-title">
          {translate('CONTRACT_Interact_Title')}
          <span className="InteractExplorer-title-address">{address}</span>
        </h3>

        <select
          value={selectedFunction ? selectedFunction.name : ''}
          className="InteractExplorer-fnselect form-control"
          onChange={this._handleFunctionSelect}
        >
          <option>{translate('CONTRACT_Interact_CTA')}</option>
          {functions.map(fn => (
            <option key={fn.name} value={fn.name}>
              {fn.name}
            </option>
          ))}
        </select>

        {selectedFunction && (
          <div key={selectedFunction.name} className="InteractExplorer-func">
            {/* TODO: Use reusable components with validation */}
            {selectedFunction.inputs.map(input => (
              <label
                key={input.name}
                className="InteractExplorer-func-in form-group"
              >
                <h4 className="InteractExplorer-func-in-label">
                  {input.name}
                  <span className="InteractExplorer-func-in-label-type">
                    {input.type}
                  </span>
                </h4>
                <input
                  className="InteractExplorer-func-in-input form-control"
                  name={input.name}
                  value={inputs[input.name]}
                  onChange={this._handleInputChange}
                />
              </label>
            ))}

            {selectedFunction.outputs.map(output => (
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

            {selectedFunction.constant ? (
              <button className="InteractExplorer-func-submit btn btn-primary">
                {/* translate('CONTRACT_Read') */}
                Implement Me
              </button>
            ) : (
              <button className="InteractExplorer-func-submit btn btn-primary">
                {/* translate('CONTRACT_Write') */}
                Implement Me
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}
