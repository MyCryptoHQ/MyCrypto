// @flow
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
    return !propsPair
      ? <Spinner />
      : <p className="mono">
          <input
            className="form-control input-sm"
            onChange={this.onChange}
            value={statePair}
            name={pair + 'Amount'}
          />
          <span>
            {` ${origin} = ${toFixedIfLarger(
              statePair * propsPair,
              6
            )} ${destination}`}
          </span>
        </p>;
  };

  render() {
    return (
      <article className="swap-rates">
        <section className="row">
          <h5 className="col-xs-6 col-xs-offset-3">
            {translate('SWAP_rates')}
          </h5>
        </section>
        <section className="row order-panel">
          {
            <div>
              <div className="col-sm-6 order-info">
                {this.buildPairRate('ETH', 'BTC')}
                {this.buildPairRate('ETH', 'REP')}
              </div>
              <div className="col-sm-6 order-info">
                {this.buildPairRate('BTC', 'ETH')}
                {this.buildPairRate('BTC', 'REP')}
              </div>
            </div>
          }
          <a className="link bity-logo" href={bityReferralURL} target="_blank">
            <img src={bityLogoWhite} width={120} height={49} />
          </a>
        </section>
      </article>
    );
  }
}
