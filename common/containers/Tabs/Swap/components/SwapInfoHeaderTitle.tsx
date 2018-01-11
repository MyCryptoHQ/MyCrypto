import { RestartSwapAction } from 'actions/swap';
import bityLogo from 'assets/images/logo-bity.svg';
import shapeshiftLogo from 'assets/images/shapeshift-dark.svg';
import { bityReferralURL } from 'config/data';
import React, { Component } from 'react';
import translate from 'translations';
import './SwapInfoHeader.scss';

export interface SwapInfoHeaderTitleProps {
  provider: string;
  restartSwap(): RestartSwapAction;
}

export default class SwapInfoHeaderTitle extends Component<SwapInfoHeaderTitleProps, {}> {
  public render() {
    const { provider } = this.props;
    const logoToRender = provider === 'shapeshift' ? shapeshiftLogo : bityLogo;
    return (
      <section className="SwapInfo-top row text-center">
        <div className="col-xs-3 text-left">
          <button className="SwapInfo-top-back" onClick={this.props.restartSwap}>
            <i className="fa fa-arrow-left" />
            Start New Swap
          </button>
        </div>
        <div className="col-xs-6">
          <h3 className="SwapInfo-top-title">{translate('SWAP_information')}</h3>
        </div>
        <div className="col-xs-3">
          <a
            className="SwapInfo-top-logo"
            href={bityReferralURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="SwapInfo-top-logo-img" src={logoToRender} />
          </a>
        </div>
      </section>
    );
  }
}
