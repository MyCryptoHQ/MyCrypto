import React, { PureComponent } from 'react';

import { shapeshiftReferralURL, bitboxReferralURL } from 'config';
import translate from 'translations';
import { RestartSwapAction } from 'features/swap/types';
import bityLogo from 'assets/images/logo-bity.svg';
import shapeshiftLogo from 'assets/images/shapeshift-dark.svg';
import './SwapInfoHeader.scss';

export interface SwapInfoHeaderTitleProps {
  provider: string;
  restartSwap(): RestartSwapAction;
}

export default class SwapInfoHeaderTitle extends PureComponent<SwapInfoHeaderTitleProps, {}> {
  public render() {
    const { provider } = this.props;
    const logoToRender = provider === 'shapeshift' ? shapeshiftLogo : bityLogo;
    return (
      <section className="SwapInfo-top row text-center">
        <div className="col-xs-3 text-left">
          <button className="SwapInfo-top-back" onClick={this.props.restartSwap}>
            <i className="fa fa-arrow-left" />
            {translate('NEW_SWAP')}
          </button>
        </div>
        <div className="col-xs-6">
          <h3 className="SwapInfo-top-title">{translate('SWAP_INFORMATION')}</h3>
        </div>
        <div className="col-xs-3">
          <a
            className="SwapInfo-top-logo"
            href={provider === 'shapeshift' ? shapeshiftReferralURL : bitboxReferralURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="SwapInfo-top-logo-img" src={logoToRender} alt={provider + ' logo'} />
          </a>
        </div>
      </section>
    );
  }
}
