import {
  NormalizedBityRates,
  NormalizedShapeshiftRates,
  NormalizedShapeshiftRate,
  NormalizedBityRate
} from 'reducers/swap/types';
import bityLogoWhite from 'assets/images/logo-bity-white.svg';
import shapeshiftLogoWhite from 'assets/images/logo-shapeshift.svg';
import Spinner from 'components/ui/Spinner';
import { bityReferralURL, shapeshiftReferralURL } from 'config/data';
import React, { Component } from 'react';
import translate from 'translations';
import { toFixedIfLarger } from 'utils/formatters';
import './CurrentRates.scss';
import shapeshift from 'api/shapeshift';

interface ReduxStateProps {
  provider: string;
  bityRates: NormalizedBityRates;
  shapeshiftRates: NormalizedShapeshiftRates;
}

interface State {
  ETHBTCAmount: number;
  ETHREPAmount: number;
  BTCETHAmount: number;
  BTCREPAmount: number;
}

export default class CurrentRates extends Component<ReduxStateProps, State> {
  public state = {
    ETHBTCAmount: 1,
    ETHREPAmount: 1,
    BTCETHAmount: 1,
    BTCREPAmount: 1
  };

  public onChange = (event: any) => {
    const { value } = event.target;
    const { name } = event.target;
    this.setState({
      [name]: value
    });
  };

  public buildPairRate = (origin: string, destination: string) => {
    const { bityRates, shapeshiftRates, provider } = this.props;
    const pair = origin + destination;
    let propsPair;
    if (provider === 'shapeshift' && shapeshiftRates.byId && shapeshiftRates.byId[pair]) {
      propsPair = (shapeshiftRates.byId[pair] as NormalizedShapeshiftRate).rate;
    } else if (bityRates.byId && bityRates.byId[pair]) {
      propsPair = (bityRates.byId[pair] as NormalizedBityRate).rate;
    }

    const statePair = this.state[pair + 'Amount'];
    return (
      <div className="SwapRates-panel-rate">
        {propsPair ? (
          <div>
            <input
              className="SwapRates-panel-rate-input"
              onChange={this.onChange}
              value={statePair}
              name={pair + 'Amount'}
            />
            <span className="SwapRates-panel-rate-amount">
              {` ${origin} = ${toFixedIfLarger(statePair * propsPair, 6)} ${destination}`}
            </span>
          </div>
        ) : (
          <Spinner size="x1" light={true} />
        )}
      </div>
    );
  };

  public render() {
    const { provider } = this.props;
    const providerLogo = provider === 'shapeshift' ? shapeshiftLogoWhite : bityLogoWhite;
    const providerURL = provider === 'shapeshift' ? shapeshiftReferralURL : bityReferralURL;
    return (
      <article className="SwapRates">
        <h3 className="SwapRates-title">{translate('SWAP_rates')}</h3>

        <section className="SwapRates-panel row">
          <div className="SwapRates-panel-side col-sm-6">
            {this.buildPairRate('ETH', 'BTC')}
            {this.buildPairRate('ETH', 'REP')}
          </div>

          <div className="SwapRates-panel-side col-sm-6">
            {this.buildPairRate('BTC', 'ETH')}
            {this.buildPairRate('BTC', 'REP')}
          </div>
          <a className="SwapRates-panel-logo" href={providerURL} target="_blank">
            <img src={providerLogo} width={120} height={49} />
          </a>
        </section>
      </article>
    );
  }
}
