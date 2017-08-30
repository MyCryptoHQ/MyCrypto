// @flow
import './CurrentRates.scss';
import React, { Component } from 'react';
import translate from 'translations';
import { toFixedIfLarger } from 'utils/formatters';
import type { Pairs } from 'actions/swapTypes';
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
      <article className="SwapRates">
        <h3 className="SwapRates-title">
          {translate('SWAP_rates')}
        </h3>

        <section className="SwapRates-panel row">
          <div className="SwapRates-panel-side col-sm-6">
            <div className="SwapRates-panel-rate">
              <input
                className="SwapRates-panel-rate-input"
                onChange={this.onChange}
                value={this.state.ETHBTCAmount}
                name="ETHBTCAmount"
              />
              <span className="SwapRates-panel-rate-amount">
                {` ETH = ${toFixedIfLarger(
                  this.state.ETHBTCAmount * ETHBTC,
                  6
                )} BTC`}
              </span>
            </div>

            <div className="SwapRates-panel-rate">
              <input
                className="SwapRates-panel-rate-input"
                onChange={this.onChange}
                value={this.state.ETHREPAmount}
                name="ETHREPAmount"
              />
              <span className="SwapRates-panel-rate-amount">
                {` ETH = ${toFixedIfLarger(
                  this.state.ETHREPAmount * ETHREP,
                  6
                )} REP`}
              </span>
            </div>
          </div>

          <div className="SwapRates-panel-side col-sm-6">
            <div className="SwapRates-panel-rate">
              <input
                className="SwapRates-panel-rate-input"
                onChange={this.onChange}
                value={this.state.BTCETHAmount}
                name="BTCETHAmount"
              />
              <span className="SwapRates-panel-rate-amount">
                {` BTC = ${toFixedIfLarger(
                  this.state.BTCETHAmount * BTCETH,
                  6
                )} ETH`}
              </span>
            </div>

            <div className="SwapRates-panel-rate">
              <input
                className="SwapRates-panel-rate-input"
                onChange={this.onChange}
                value={this.state.BTCREPAmount}
                name="BTCREPAmount"
              />
              <span className="SwapRates-panel-rate-amount">
                {` BTC = ${toFixedIfLarger(
                  this.state.BTCREPAmount * BTCREP,
                  6
                )} REP`}
              </span>
            </div>
          </div>
          <a
            className="SwapRates-panel-logo"
            href={bityReferralURL}
            target="_blank"
          >
            <img src={bityLogoWhite} width={120} height={49} />
          </a>
        </section>
      </article>
    );
  }
}
