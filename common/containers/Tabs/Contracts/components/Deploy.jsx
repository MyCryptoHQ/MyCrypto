// @flow
import React, { Component } from 'react';
import translate from 'translations';

type Props = {};

export default class Deploy extends Component {
  props: Props;

  state = {
    byteCode: '',
    gasLimit: ''
  };

  _handleInput = (ev: SyntheticInputEvent) => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  render() {
    const { byteCode, gasLimit } = this.state;

    // TODO: Use common components for byte code / gas price
    return (
      <div className="Deploy">
        <label className="Deploy-field form-group">
          <h4 className="Deploy-field-label">
            {translate('CONTRACT_ByteCode')}
          </h4>
          <textarea
            name="byteCode"
            placeholder="0x8f87a973e..."
            rows={6}
            onChange={this._handleInput}
            className="Deploy-field-input form-control"
            value={byteCode}
          />
        </label>

        <label className="Deploy-field form-group">
          <h4 className="Deploy-field-label">
            {translate('CONTRACT_ByteCode')}
          </h4>
          <input
            name="gasLimit"
            value={gasLimit}
            onChange={this._handleInput}
            className="Deploy-field-input form-control"
          />
        </label>

        <button className="Deploy-submit btn btn-primary">Implement Me</button>
      </div>
    );
  }
}
