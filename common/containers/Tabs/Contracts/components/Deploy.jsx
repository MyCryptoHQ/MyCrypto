// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import ByteCodeInput from 'components/inputs/ByteCodeInput';
import GasInput from 'components/inputs/GasInput';
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
      <div className="Interact">
        <ByteCodeInput
          label={translate('CONTRACT_ByteCode')}
          name="byteCode"
          value={byteCode}
          onChange={this._handleInput}
          isTextarea={true}
        />

        <GasInput
          label={translate('TRANS_gas')}
          name="gasLimit"
          value={gasLimit}
          onChange={this._handleInput}
        />
      </div>
    );
  }
}
