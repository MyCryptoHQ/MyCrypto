import React, { Component } from 'react';
import translate from 'translations';
import PropTypes from 'prop-types';

export default class CurrentRates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ETHBTCAmount: 1,
      ETHREPAmount: 1,
      BTCETHAmount: 1,
      BTCREPAmount: 1
    };
  }

  static propTypes = {
    ETHBTC: PropTypes.number,
    ETHREP: PropTypes.number,
    BTCETH: PropTypes.number,
    BTCREP: PropTypes.number
  };

  onChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  // TODO - A little code duplication here, but simple enough to where it doesn't seem worth the time to fix.
  render() {
    return (
      <article className="swap-rates">
        <section className="row">
          <h5 className="col-xs-6 col-xs-offset-3">
            {translate('SWAP_rates')}
          </h5>
        </section>
        <section className="row order-panel">
          <div className="col-sm-6 order-info">
            <p className="mono">
              <input
                className="form-control input-sm"
                onChange={this.onChange}
                value={this.state.ETHBTCAmount}
                name="ETHBTCAmount"
              />
              <span>
                ETH = {(this.state.ETHBTCAmount * this.props.ETHBTC).toFixed(
                  6
                )}{' '}
                BTC
              </span>
            </p>
            <p className="mono">
              <input
                className="form-control input-sm"
                onChange={this.onChange}
                value={this.state.ETHREPAmount}
                name="ETHREPAmount"
              />
              <span>
                ETH = {(this.state.ETHREPAmount * this.props.ETHREP).toFixed(
                  6
                )}{' '}
                REP
              </span>
            </p>
          </div>
          <div className="col-sm-6 order-info">
            <p className="mono">
              <input
                className="form-control input-sm"
                onChange={this.onChange}
                value={this.state.BTCETHAmount}
                name="BTCETHAmount"
              />
              <span>
                BTC = {(this.state.BTCETHAmount * this.props.BTCETH).toFixed(
                  6
                )}{' '}
                ETH
              </span>
            </p>
            <p className="mono">
              <input
                className="form-control input-sm"
                onChange={this.onChange}
                value={this.state.BTCREPAmount}
                name="BTCREPAmount"
              />
              <span>
                BTC = {(this.state.BTCREPAmount * this.props.BTCREP).toFixed(
                  6
                )}{' '}
                REP
              </span>
            </p>
          </div>
          <a
            className="link bity-logo"
            href="https://bity.com/af/jshkb37v"
            target="_blank"
          >
            <img
              src={'https://www.myetherwallet.com/images/logo-bity-white.svg'}
              width={120}
              height={49}
            />
          </a>
        </section>
      </article>
    );
  }
}
