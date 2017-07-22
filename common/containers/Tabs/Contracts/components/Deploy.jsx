// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import './Deploy.scss';

type Props = {};

export default class Deploy extends Component {
  props: Props;
  static propTypes = {};

  state = {
    byteCode: '',
    gasLimit: ''
  };

  _handleInput = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  render() {
    const { byteCode, gasLimit } = this.state;

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
      </div>
    );
  }
}
