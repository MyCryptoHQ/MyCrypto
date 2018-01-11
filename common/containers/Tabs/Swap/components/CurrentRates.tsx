import {
  NormalizedBityRates,
  NormalizedShapeshiftRates,
  NormalizedShapeshiftRate
} from 'reducers/swap/types';
import bityLogoWhite from 'assets/images/logo-bity-white.svg';
import shapeshiftLogoWhite from 'assets/images/logo-shapeshift.svg';
import Spinner from 'components/ui/Spinner';
import { bityReferralURL, shapeshiftReferralURL } from 'config/data';
import React, { Component } from 'react';
import translate from 'translations';
import './CurrentRates.scss';
import { SHAPESHIFT_WHITELIST } from 'api/shapeshift';
import { ProviderName } from 'actions/swap';
import sample from 'lodash/sample';
import times from 'lodash/times';
import Rates from './Rates';

interface Props {
  provider: ProviderName;
  bityRates: NormalizedBityRates;
  shapeshiftRates: NormalizedShapeshiftRates;
}

export default class CurrentRates extends Component<Props> {
  private shapeShiftRateCache = null;

  public getRandomSSPairData = (
    shapeshiftRates: NormalizedShapeshiftRates
  ): NormalizedShapeshiftRate => {
    const coinOne = sample(SHAPESHIFT_WHITELIST) as string;
    const coinTwo = sample(SHAPESHIFT_WHITELIST) as string;
    const pair = coinOne + coinTwo;
    const pairData = shapeshiftRates.byId[pair];
    if (pairData) {
      return pairData;
    } else {
      // if random pairing is unavailable / missing in state
      return this.getRandomSSPairData(shapeshiftRates);
    }
  };

  public buildSSPairs = (shapeshiftRates: NormalizedShapeshiftRates, n: number = 4) => {
    const pairCollection = times(n, () => this.getRandomSSPairData(shapeshiftRates));
    const byId = pairCollection.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
    const allIds = pairCollection.map(SSData => SSData.id);
    return {
      byId,
      allIds
    };
  };

  public isValidRates = rates => {
    return rates && rates.allIds && rates.allIds.length > 0;
  };

  public setupRates = () => {
    const { shapeshiftRates, bityRates, provider } = this.props;

    let fixedRates;
    if (provider === 'bity') {
      fixedRates = bityRates;
    } else if (provider === 'shapeshift') {
      // if ShapeShift rates are valid, filter to 4 random pairs
      if (this.isValidRates(shapeshiftRates)) {
        if (!this.shapeShiftRateCache) {
          fixedRates = this.buildSSPairs(shapeshiftRates);
          this.shapeShiftRateCache = fixedRates;
        } else {
          fixedRates = this.shapeShiftRateCache;
        }
      } else {
        // else, pass along invalid rates. Child component will handle showing spinner until they become valid
        fixedRates = shapeshiftRates;
      }
    }

    return fixedRates;
  };

  public swapEl = (providerURL, providerLogo, children) => {
    return (
      <article className="SwapRates">
        <h3 className="SwapRates-title">{translate('SWAP_rates')}</h3>

        <section className="SwapRates-panel row">
          {children}
          <a
            className="SwapRates-panel-logo"
            href={providerURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={providerLogo} width={120} height={49} />
          </a>
        </section>
      </article>
    );
  };

  public render() {
    const { provider } = this.props;
    const rates = this.setupRates();
    const providerLogo = provider === 'shapeshift' ? shapeshiftLogoWhite : bityLogoWhite;
    const providerURL = provider === 'shapeshift' ? shapeshiftReferralURL : bityReferralURL;

    let children;

    if (this.isValidRates(rates)) {
      children = <Rates provider={provider} rates={rates} />;
    } else {
      // TODO - de-dup
      children = (
        <>
          <div className="SwapRates-panel-side col-sm-6">
            <div className="SwapRates-panel-rate">
              <Spinner size="x1" light={true} />
            </div>
            <div className="SwapRates-panel-rate">
              <Spinner size="x1" light={true} />
            </div>
          </div>

          <div className="SwapRates-panel-side col-sm-6">
            <div className="SwapRates-panel-rate">
              <Spinner size="x1" light={true} />
            </div>
            <div className="SwapRates-panel-rate">
              <Spinner size="x1" light={true} />
            </div>
          </div>
        </>
      );
    }

    return this.swapEl(providerURL, providerLogo, children);
  }
}
