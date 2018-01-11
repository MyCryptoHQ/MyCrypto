import { TShowNotification } from 'actions/notifications';
import bityConfig from 'config/bity';
import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
import './SwapProgress.scss';

export interface Props {
  destinationId: string;
  originId: string;
  destinationAddress: string;
  outputTx: string;
  provider: string;
  bityOrderStatus: string | null;
  shapeshiftOrderStatus: string | null;
  // actions
  showNotification: TShowNotification;
}

interface State {
  hasShownViewTx: boolean;
}
export default class SwapProgress extends Component<Props, State> {
  public state = {
    hasShownViewTx: false
  };

  public componentDidMount() {
    this.showSwapNotification();
  }

  public showSwapNotification = () => {
    const { hasShownViewTx } = this.state;
    const {
      destinationId,
      outputTx,
      showNotification,
      provider,
      bityOrderStatus,
      shapeshiftOrderStatus
    } = this.props;
    const isShapeshift = provider === 'shapeshift';

    if (isShapeshift ? shapeshiftOrderStatus === 'complete' : bityOrderStatus === 'FILL') {
      if (!hasShownViewTx) {
        let linkElement: React.ReactElement<HTMLAnchorElement>;
        let link;
        const notificationMessage = translateRaw('SUCCESS_3') + outputTx;
        // everything but BTC is a token
        if (destinationId !== 'BTC') {
          link = bityConfig.ETHTxExplorer(outputTx);
          linkElement = (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {notificationMessage}
            </a>
          );
          // BTC uses a different explorer
        } else {
          link = bityConfig.BTCTxExplorer(outputTx);
          linkElement = (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {notificationMessage}
            </a>
          );
        }
        this.setState({ hasShownViewTx: true }, () => {
          showNotification('success', linkElement);
        });
      }
    }
  };

  public computedClass = (step: number) => {
    const { bityOrderStatus, shapeshiftOrderStatus } = this.props;

    let cssClass = 'SwapProgress-item';
    const orderStatus = bityOrderStatus || shapeshiftOrderStatus;
    switch (orderStatus) {
      case 'no_deposits':
      case 'OPEN':
        if (step < 2) {
          return cssClass + ' is-complete';
        } else if (step === 2) {
          return cssClass + ' is-active';
        } else {
          return cssClass;
        }
      case 'received':
      case 'RCVE':
        if (step < 4) {
          return cssClass + ' is-complete';
        } else if (step === 4) {
          return cssClass + ' is-active';
        } else {
          return cssClass;
        }
      case 'complete':
      case 'FILL':
        cssClass += ' is-complete';
        return cssClass;
      case 'failed':
      case 'CANC':
        return cssClass;
      default:
        return cssClass;
    }
  };

  public render() {
    const { originId, destinationId } = this.props;
    const numberOfConfirmations = originId === 'BTC' ? '3' : '10';
    const steps = [
      // 1
      translate('SWAP_progress_1'),
      // 2
      <span key="1">
        {translate('SWAP_progress_2')} {originId}...
      </span>,
      // 3
      <span key="2">
        {originId} {translate('SWAP_progress_3')}
      </span>,
      // 4 TODO: Translate me
      <span key="3">
        Sending your {destinationId}
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
                <span className="SwapProgress-item-circle-number">{idx + 1}</span>
              </div>
              <p className="SwapProgress-item-text">{text}</p>
            </div>
          );
        })}
      </section>
    );
  }
}
