// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './GasPriceDropdown.scss';
import { gasPriceDefaults } from 'config/data';

export default class GasPriceDropdown extends Component {
  state = { expanded: false };

  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired
  };

  render() {
    return (
      <span className="dropdown">
        <a
          aria-haspopup="true"
          aria-label="adjust gas price"
          className="dropdown-toggle"
          onClick={this.toggleExpanded}
        >
          <span>Gas Price</span>: {this.props.value} Gwei
          <i className="caret" />
        </a>
        {this.state.expanded &&
          <ul className="dropdown-menu GasPrice-dropdown-menu">
            <div className="GasPrice-header">
              <span>Gas Price</span>: {this.props.value} Gwei
              <input
                type="range"
                value={this.props.value}
                min={gasPriceDefaults.gasPriceMinGwei}
                max={gasPriceDefaults.gasPriceMaxGwei}
                onChange={this.updateGasPrice}
              />
              <p className="small col-xs-4 text-left GasPrice-padding-reset">
                Not So Fast
              </p>
              <p className="small col-xs-4 text-center GasPrice-padding-reset">
                Fast
              </p>
              <p className="small col-xs-4 text-right GasPrice-padding-reset">
                Fast AF
              </p>
              <p className="small GasPrice-description">
                Gas Price is the amount you pay per unit of gas.{' '}
                <code>TX fee = gas price * gas limit</code> & is paid to miners
                for including your TX in a block. Higher the gas price = faster
                transaction, but more expensive. Default is <code>21 GWEI</code>.
              </p>
              <p>
                {/* TODO: maybe not hardcode a link? :) */}
                <a
                  href="https://myetherwallet.groovehq.com/knowledge_base/topics/what-is-gas"
                  target="_blank"
                >
                  Read more
                </a>
              </p>
            </div>
          </ul>}
      </span>
    );
  }

  toggleExpanded = () => {
    this.setState(state => {
      return {
        expanded: !state.expanded
      };
    });
  };

  updateGasPrice = (e: SyntheticInputEvent) => {
    this.props.onChange(parseInt(e.target.value, 10));
  };
}
