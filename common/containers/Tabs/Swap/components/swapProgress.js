import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { toFixedIfLarger } from 'utils/formatters';
// import translate from 'translations';

export default class SwapProgress extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    numberOfConfirmations: PropTypes.number,
    destinationKind: PropTypes.string,
    originKind: PropTypes.string,
    activeStep: PropTypes.number
  };

  render() {
    const { numberOfConfirmations, destinationKind, originKind } = this.props;
    return (
      <section className="row swap-progress">
        <div className="sep" />
        <div className="progress-item  progress-true">
          <div className="progress-circle"><i>1</i></div>
          <p className="ng-scope">Order Initiated</p>
        </div>
        <div className="progress-item progress-true">
          <div className="progress-circle"><i>2</i></div>
          <p>
            <span className="ng-scope">Waiting for your </span>{originKind}...
          </p>
        </div>
        <div className="progress-item progress-active">
          <div className="progress-circle"><i>3</i></div>
          <p>
            ETH <span className="ng-scope">Received!</span>
          </p>
        </div>
        <div className="progress-item">
          <div className="progress-circle"><i>4</i></div>
          <p>
            <span className="ng-scope">destination your</span>{' '}
            {destinationKind} <br />
            <small>
              Waiting for {numberOfConfirmations} confirmations...
            </small>
          </p>
        </div>
        <div className="progress-item">
          <div className="progress-circle"><i>5</i></div>
          <p className="ng-scope">Order Complete</p>
        </div>
      </section>
    );
  }
}
