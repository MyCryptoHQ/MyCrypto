// @flow
import React, { Component } from 'react';
import translate from 'translations';
import { toFixedIfLarger } from 'utils/formatters';
import { Pairs } from 'actions/swapTypes';
import { bityReferralURL } from 'config/data';
import bityLogoWhite from 'assets/images/logo-bity-white.svg';

export default class CurrentRates extends Component {
  props: Pairs;

  state = {
    ETHBTCAmount: 1,
    ETHREPAmount: 1,
    BTCETHAmount: 1,
    BTCREPAmount: 1
  };

  onChange = (event: SyntheticInputEvent) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { ETHBTC, ETHREP, BTCETH, BTCREP } = this.props;

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
                {` ETH = ${toFixedIfLarger(
                  this.state.ETHBTCAmount * ETHBTC,
                  6
                )} BTC`}
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
                {` ETH = ${toFixedIfLarger(
                  this.state.ETHREPAmount * ETHREP,
                  6
                )} REP`}
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
                {` BTC = ${toFixedIfLarger(
                  this.state.BTCETHAmount * BTCETH,
                  6
                )} ETH`}
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
                {` BTC = ${toFixedIfLarger(
                  this.state.BTCREPAmount * BTCREP,
                  6
                )} REP`}
              </span>
            </p>
          </div>
          <a className="link bity-logo" href={bityReferralURL} target="_blank">
            <img src={bityLogoWhite} width={120} height={49} />
          </a>
        </section>
      </article>
    );
  }
}
