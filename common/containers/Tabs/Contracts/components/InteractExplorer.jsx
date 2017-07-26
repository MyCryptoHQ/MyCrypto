// @flow
import React, { Component } from 'react';
import translate from 'translations';
import type { ABIFunction } from 'actions/contracts';
import './InteractExplorer.scss';

type Props = {
  address: ?string,
  functions: ?Array<ABIFunction>
};

type State = {
  selectedFunction: ?ABIFunction,
  inputs: Object,
  outputs: Object
};

export default class InteractExplorer extends Component {
  props: Props;

  state: State = {
    selectedFunction: null,
    inputs: {},
    outputs: {}
  };

  _handleFunctionSelect = (ev: SyntheticInputEvent) => {
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

  _handleInputChange = (ev: SyntheticInputEvent) => {
    this.setState({
      inputs: {
        ...this.state.inputs,
        [ev.target.name]: ev.target.value
      }
    });
  };

  render() {
    const { address, functions } = this.props;
    const { selectedFunction, inputs, outputs } = this.state;

    if (!functions) {
      return null;
    }

    return (
      <div className="InteractExplorer">
        <h3 className="InteractExplorer-title">
          {translate('CONTRACT_Interact_Title')}
          <span className="InteractExplorer-title-address">
            {address}
          </span>
        </h3>

        <select
          value={selectedFunction ? selectedFunction.name : ''}
          className="InteractExplorer-fnselect form-control"
          onChange={this._handleFunctionSelect}
        >
          <option>
            {translate('CONTRACT_Interact_CTA')}
          </option>
          {functions.map(fn =>
            <option key={fn.name} value={fn.name}>
              {fn.name}
            </option>
          )}
        </select>

        {selectedFunction &&
          <div key={selectedFunction.name} className="InteractExplorer-func">
            {/* TODO: Use reusable components with validation */}
            {selectedFunction.inputs.map(input =>
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
            )}

            {selectedFunction.outputs.map(output =>
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
                  disabled
                />
              </label>
            )}

            {selectedFunction.constant
              ? <button className="InteractExplorer-func-submit btn btn-primary">
                  {/* translate('CONTRACT_Read') */}
                  Implement Me
                </button>
              : <button className="InteractExplorer-func-submit btn btn-primary">
                  {/* translate('CONTRACT_Write') */}
                  Implement Me
                </button>}
          </div>}
      </div>
    );
  }
}
