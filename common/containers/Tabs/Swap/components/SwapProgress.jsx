//flow
import React, { Component } from 'react';
import translate from 'translations';

export type StateProps = {
  numberOfConfirmations: number,
  destinationKind: string,
  originKind: string,
  orderStatus: string
};

export default class SwapProgress extends Component {
  props: StateProps;

  computedClass(step: number) {
    const { orderStatus } = this.props;
    let cssClass = 'progress-item';
    switch (orderStatus) {
      case 'OPEN':
        if (step === 1) {
          return cssClass + ' progress-true';
        } else if (step === 2) {
          return cssClass + ' progress-active';
        } else {
          return cssClass;
        }
      case 'RCVE':
        if (step < 3) {
          return cssClass + ' progress-true';
        } else if (step === 3) {
          return cssClass + ' progress-active';
        } else {
          return cssClass;
        }
      case 'CANC':
        return cssClass;
      case 'FILL':
        if (step < 4) {
          return cssClass + ' progress-true';
        } else if (step === 4) {
          return cssClass + ' progress-active';
        } else {
          return cssClass;
        }
      default:
        return cssClass;
    }
  }

  render() {
    const { numberOfConfirmations, destinationKind, originKind } = this.props;
    return (
      <section className="row swap-progress">
        <div className="sep" />

        <div className={this.computedClass(1)}>
          <div className="progress-circle">
            <i>1</i>
          </div>
          <p>
            {translate('SWAP_progress_1')}
          </p>
        </div>
        <div className={this.computedClass(2)}>
          <div className="progress-circle">
            <i>2</i>
          </div>
          <p>
            <span>{translate('SWAP_progress_2')}</span>
            {originKind}...
          </p>
        </div>
        <div className={this.computedClass(3)}>
          <div className="progress-circle">
            <i>3</i>
          </div>
          <p>
            {originKind} <span>{translate('SWAP_progress_3')}</span>
          </p>
        </div>
        <div className={this.computedClass(4)}>
          <div className="progress-circle">
            <i>4</i>
          </div>
          <p>
            <span>Sending your </span>
            {destinationKind}
            <br />
            <small>
              Waiting for {numberOfConfirmations} confirmations...
            </small>
          </p>
        </div>
        <div className={this.computedClass(5)}>
          <div className="progress-circle">
            <i>5</i>
          </div>
          <p>Order Complete</p>
        </div>
      </section>
    );
  }
}
