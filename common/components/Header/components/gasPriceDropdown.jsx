// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './GasPriceDropdown.scss';

export default class gasPriceDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  static propTypes = {
    gasPriceGwei: PropTypes.number,
    gasPriceMinGwei: PropTypes.number,
    gasPriceMaxGwei: PropTypes.number,
    changeGasPrice: PropTypes.func
  };

  render() {
    // col-xs-4 applies padding not observed in MEWv3, this overrides
    const paddingReset = { paddingLeft: '0px', paddingRight: '0px' };

    return (
      <span className="dropdown">
        <a
          aria-haspopup="true"
          aria-label="adjust gas price"
          className="dropdown-toggle"
          onClick={this.toggleExpanded}
        >
          <span>Gas Price</span>: {this.props.gasPriceGwei} Gwei
          <i className="caret" />
        </a>
        {this.state.expanded &&
          <ul
            className="dropdown-menu"
            style={{ padding: '.5rem', minWidth: '300px' }}
          >
            <div className="GasPrice-header">
              <span>Gas Price</span>: {this.props.gasPriceGwei} Gwei
              <input
                type="range"
                value={this.props.gasPriceGwei}
                min={this.props.gasPriceMinGwei}
                max={this.props.gasPriceMaxGwei}
                onChange={this.updateGasPrice}
              />
              <p style={paddingReset} className="small col-xs-4 text-left">
                Not So Fast
              </p>
              <p style={paddingReset} className="small col-xs-4 text-center">
                Fast
              </p>
              <p style={paddingReset} className="small col-xs-4 text-right">
                Fast AF
              </p>
              <p
                className="small"
                style={{
                  whiteSpace: 'normal',
                  fontWeight: '300',
                  margin: '2rem 0 0'
                }}
              >
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
    this.props.changeGasPrice(e.currentTarget.valueAsNumber);
  };
}
