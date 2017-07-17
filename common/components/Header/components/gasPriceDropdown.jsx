// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';


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

  /* TODO: actually style this widget :) */

  render() {
    return (


    <span className="dropdown" style={{color: 'black'}}>
      <a
        aria-haspopup="true"
        aria-label="adjust gas price"
        className="dropdown-toggle btn btn-white"
        onClick={this.toggleExpanded}
      >
        <span>Gas Price</span>: {this.props.gasPriceGwei} Gwei
        <i className="caret"></i>
      </a>
      {this.state.expanded &&
        <ul className="dropdown-menu">
          <div className="header--gas">
            <span>Gas Price</span>: {this.props.gasPriceGwei} Gwei
            <input
              type="range"
              min={this.props.gasPriceMinGwei}
              max={this.props.gasPriceMaxGwei}
              onChange={this.updateGasPrice}
            />
            <p className="small col-xs-4 text-left">Not So Fast</p>
            <p className="small col-xs-4 text-center">Fast</p>
            <p className="small col-xs-4 text-right">Fast AF</p>
            <p className="small" style={{'whiteSpace':'normal', 'fontWeight': '300', 'margin':'2rem 0 0'}}>
              Gas Price is the amount you pay per unit of gas. TX fee = gas price * gas limit & is paid to miners for including your TX in a block. Higher the gas price = faster transaction, but more expensive. Default is 21 GWEI.
            </p>
            <p>
              <a
                href="https://myetherwallet.groovehq.com/knowledge_base/topics/what-is-gas"
                target="_blank"
                style={{color: 'black'}}
              >
                Read more
              </a>
            </p>
          </div>
        </ul>}
    </span>

    )
  }

  toggleExpanded = () => {
    this.setState(state => {
      return {
        expanded: !state.expanded
      };
    });
  };

  updateGasPrice = (e) => {
    this.props.changeGasPrice(e.currentTarget.valueAsNumber);
  }
}
