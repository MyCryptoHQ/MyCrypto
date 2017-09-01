// @flow
import './CurrentRates.scss';
import React, { Component } from 'react';
import translate from 'translations';
import { toFixedIfLarger } from 'utils/formatters';
import type { Pairs } from 'actions/swapTypes';
import { bityReferralURL } from 'config/data';
import bityLogoWhite from 'assets/images/logo-bity-white.svg';
import Spinner from 'components/ui/Spinner';

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

  buildPairRate = (origin: string, destination: string) => {
    const pair = origin + destination;
    const statePair = this.state[pair + 'Amount'];
    const propsPair = this.props[pair];
    return (
      <div className="SwapRates-panel-rate">
        {propsPair
          ? <div>
              <input
                className="SwapRates-panel-rate-input"
                onChange={this.onChange}
                value={statePair}
                name={pair + 'Amount'}
              />
              <span className="SwapRates-panel-rate-amount">
                {` ${origin} = ${toFixedIfLarger(
                  statePair * propsPair,
                  6
                )} ${destination}`}
              </span>
            </div>
          : <Spinner />}
      </div>
    );
  };

  render() {
    return (
      <article className="SwapRates">
        <h3 className="SwapRates-title">
          {translate('SWAP_rates')}
        </h3>

        <section className="SwapRates-panel row">
          <div className="SwapRates-panel-side col-sm-6">
            {this.buildPairRate('ETH', 'BTC')}
            {this.buildPairRate('ETH', 'REP')}
          </div>

          <div className="SwapRates-panel-side col-sm-6">
            {this.buildPairRate('BTC', 'ETH')}
            {this.buildPairRate('BTC', 'REP')}
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
