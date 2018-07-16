import React, { PureComponent } from 'react';

import { bityConfig } from 'config/bity';
import translate, { translateRaw } from 'translations';
import { notificationsActions } from 'features/notifications';
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
  showNotificationWithComponent: notificationsActions.TShowNotificationWithComponent;
}

interface State {
  hasShownViewTx: boolean;
}
export default class SwapProgress extends PureComponent<Props, State> {
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
      showNotificationWithComponent,
      provider,
      bityOrderStatus,
      shapeshiftOrderStatus
    } = this.props;
    const isShapeshift = provider === 'shapeshift';

    if (isShapeshift ? shapeshiftOrderStatus === 'complete' : bityOrderStatus === 'FILL') {
      if (!hasShownViewTx) {
        let link: string;
        const notificationMessage = translateRaw('SUCCESS_3') + outputTx;
        // everything but BTC is a token
        if (destinationId !== 'BTC') {
          link = bityConfig.ETHTxExplorer(outputTx);
          // BTC uses a different explorer
        } else {
          link = bityConfig.BTCTxExplorer(outputTx);
        }

        this.setState({ hasShownViewTx: true }, () => {
          showNotificationWithComponent('success', notificationMessage, {
            component: 'a',
            href: link,
            target: '_blank',
            rel: 'noopener noreferrer'
          });
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
      translate('SWAP_PROGRESS_1'),
      // 2
      <span key="1">{translate('SWAP_PROGRESS_2', { $origin_id: originId })}</span>,
      // 3
      <span key="2">{translate('SWAP_PROGRESS_3', { $origin_id: originId })}</span>,
      // 4 TODO: Translate me
      <span key="3">
        {translate('SWAP_PROGRESS_4', { $destination_id: destinationId })}
        <br />
        <small>
          {translate('SWAP_PROGRESS_CONFIRMATIONS', {
            $number_confirmations: numberOfConfirmations
          })}
        </small>
      </span>,
      // 5
      translate('SWAP_PROGRESS_5')
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
