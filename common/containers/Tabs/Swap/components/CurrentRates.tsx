import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import sample from 'lodash/sample';
import times from 'lodash/times';

import { bityReferralURL, shapeshiftReferralURL } from 'config';
import translate from 'translations';
import { SHAPESHIFT_WHITELIST } from 'api/shapeshift';
import { AppState } from 'features/reducers';
import { Optional } from 'utils/types';
import {
  ProviderName,
  NormalizedBityRates,
  NormalizedShapeshiftRates,
  NormalizedShapeshiftRate
} from 'features/swap/types';
import {
  loadShapeshiftRatesRequestedSwap,
  TLoadShapeshiftRatesRequestedSwap,
  stopLoadShapeshiftRatesSwap,
  TStopLoadShapeshiftRatesSwap
} from 'features/swap/actions';
import { getOffline } from 'features/config';
import bityLogoWhite from 'assets/images/logo-bity-white.svg';
import shapeshiftLogoWhite from 'assets/images/logo-shapeshift.svg';
import Spinner from 'components/ui/Spinner';
import Rates from './Rates';
import './CurrentRates.scss';

interface StateProps {
  isOffline: boolean;
  provider: ProviderName;
  bityRates: NormalizedBityRates;
  shapeshiftRates: NormalizedShapeshiftRates;
}

interface ActionProps {
  loadShapeshiftRatesRequestedSwap: TLoadShapeshiftRatesRequestedSwap;
  stopLoadShapeshiftRatesSwap: TStopLoadShapeshiftRatesSwap;
}

type Props = StateProps & ActionProps;

class CurrentRates extends PureComponent<Props> {
  private shapeShiftRateCache: any = null;

  public componentDidMount() {
    if (!this.props.isOffline) {
      this.loadRates();
    }
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.isOffline && !nextProps.isOffline) {
      this.loadRates();
    }
  }

  public componentWillUnmount() {
    this.props.stopLoadShapeshiftRatesSwap();
  }

  public loadRates() {
    this.props.loadShapeshiftRatesRequestedSwap();
  }

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
    const byId = pairCollection.reduce<{ [id: string]: NormalizedShapeshiftRate }>((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
    const allIds = pairCollection.map(SSData => SSData.id);
    return {
      byId,
      allIds
    };
  };

  public isValidRates = (rates: Optional<NormalizedShapeshiftRates>) => {
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

  public swapEl = (providerURL: string, providerLogo: string, children: any) => {
    return (
      <article className="SwapRates">
        <h3 className="SwapRates-title">{translate('SWAP_RATES')}</h3>

        <section className="SwapRates-panel row">
          {children}
          <a
            className="SwapRates-panel-logo"
            href={providerURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={providerLogo} width={120} height={49} alt="Shapeshift Logo" />
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
        <React.Fragment>
          <div className="SwapRates-panel-side col-sm-6">
            <div className="SwapRates-panel-rate is-loading">
              <Spinner size="x1" light={true} />
            </div>
            <div className="SwapRates-panel-rate is-loading">
              <Spinner size="x1" light={true} />
            </div>
          </div>

          <div className="SwapRates-panel-side col-sm-6">
            <div className="SwapRates-panel-rate is-loading">
              <Spinner size="x1" light={true} />
            </div>
            <div className="SwapRates-panel-rate is-loading">
              <Spinner size="x1" light={true} />
            </div>
          </div>
        </React.Fragment>
      );
    }

    return this.swapEl(providerURL, providerLogo, children);
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    isOffline: getOffline(state),
    provider: state.swap.provider,
    bityRates: state.swap.bityRates,
    shapeshiftRates: state.swap.shapeshiftRates
  };
}

export default connect(mapStateToProps, {
  loadShapeshiftRatesRequestedSwap,
  stopLoadShapeshiftRatesSwap
})(CurrentRates);
