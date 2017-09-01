//flow
import './SwapProgress.scss';
import React, { Component } from 'react';
import translate from 'translations';
import bityConfig from 'config/bity';

export type Props = {
  destinationKind: string,
  destinationAddress: string,
  outputTx: string,
  originKind: string,
  orderStatus: string,
  // actions
  showNotification: Function
};

export default class SwapProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasShownViewTx: false
    };
  }

  props: Props;

  componentDidMount() {
    this.showNotification();
  }

  showNotification = () => {
    const { hasShownViewTx } = this.state;
    const {
      destinationKind,
      outputTx,
      showNotification,
      orderStatus
    } = this.props;

    if (orderStatus === 'FILL') {
      if (!hasShownViewTx) {
        let linkElement;
        let link;
        const notificationMessage = translate('SUCCESS_3', true) + outputTx;
        // everything but BTC is a token
        if (destinationKind !== 'BTC') {
          link = bityConfig.ethExplorer.replace('[[txHash]]', outputTx);
          linkElement = (
            <a href={link} target="_blank" rel="noopener">
              ${notificationMessage}
            </a>
          );
          // BTC uses a different explorer
        } else {
          link = bityConfig.btcExplorer.replace('[[txHash]]', outputTx);
          linkElement = (
            <a href={link} target="_blank" rel="noopener">
              ${notificationMessage}
            </a>
          );
        }
        this.setState({ hasShownViewTx: true }, () => {
          showNotification('success', linkElement);
        });
      }
    }
  };

  computedClass = (step: number) => {
    const { orderStatus } = this.props;

    let cssClass = 'SwapProgress-item';

    switch (orderStatus) {
      case 'OPEN':
        if (step < 2) {
          return cssClass + ' is-complete';
        } else if (step === 2) {
          return cssClass + ' is-active';
        } else {
          return cssClass;
        }
      case 'RCVE':
        if (step < 4) {
          return cssClass + ' is-complete';
        } else if (step === 4) {
          return cssClass + ' is-active';
        } else {
          return cssClass;
        }
      case 'FILL':
        cssClass += ' is-complete';
        return cssClass;
      case 'CANC':
        return cssClass;
      default:
        return cssClass;
    }
  };

  render() {
    const { destinationKind, originKind } = this.props;
    const numberOfConfirmations = originKind === 'BTC' ? '3' : '10';
    const steps = [
      // 1
      translate('SWAP_progress_1'),
      // 2
      <span>
        {translate('SWAP_progress_2')} {originKind}...
      </span>,
      // 3
      <span>
        {originKind} {translate('SWAP_progress_3')}
      </span>,
      // 4 TODO: Translate me
      <span>
        Sending your {destinationKind}
        <br />
        <small>Waiting for {numberOfConfirmations} confirmations...</small>
      </span>,
      // 5
      translate('SWAP_progress_5')
    ];

    return (
      <section className="SwapProgress">
        <div className="SwapProgress-track" />

        {steps.map((text, idx) => {
          return (
            <div key={idx} className={this.computedClass(idx + 1)}>
              <div className={`SwapProgress-item-circle position-${idx + 1}`}>
                <span className="SwapProgress-item-circle-number">
                  {idx + 1}
                </span>
              </div>
              <p className="SwapProgress-item-text">
                {text}
              </p>
            </div>
          );
        })}
      </section>
    );
  }
}
