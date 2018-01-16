import React from 'react';
import { GasLimitFieldFactory } from './GasLimitFieldFactory';
import translate from 'translations';
import { CSSTransition } from 'react-transition-group';
import { Spinner } from 'components/ui';
import { gasLimitValidator } from 'libs/validators';

interface Props {
  includeLabel: boolean;
  onlyIncludeLoader: boolean;
  customLabel?: string;
}

export const GaslimitLoading: React.SFC<{ gasEstimationPending: boolean }> = ({
  gasEstimationPending
}) => (
  <CSSTransition in={gasEstimationPending} timeout={300} classNames="fade">
    <div className={`SimpleGas-estimating small ${gasEstimationPending ? 'active' : ''}`}>
      Calculating gas limit
      <Spinner />
    </div>
  </CSSTransition>
);

export const GasLimitField: React.SFC<Props> = ({
  includeLabel,
  onlyIncludeLoader,
  customLabel
}) => (
  <React.Fragment>
    <GasLimitFieldFactory
      withProps={({ gasLimit: { raw }, onChange, readOnly, gasEstimationPending }) => (
        <>
          <div className="label-wraper flex-wrapper">
            {includeLabel ? (
              customLabel ? (
                <label>{customLabel} </label>
              ) : (
                <label>{translate('TRANS_gas')} </label>
              )
            ) : null}
            <div className="flex-spacer" />
            <GaslimitLoading gasEstimationPending={gasEstimationPending} />
          </div>
          {onlyIncludeLoader ? null : (
            <input
              className={`form-control ${gasLimitValidator(raw) ? 'is-valid' : 'is-invalid'}`}
              type="number"
              placeholder="e.g. 21000"
              readOnly={!!readOnly}
              value={raw}
              onChange={onChange}
            />
          )}
        </>
      )}
    />
  </React.Fragment>
);
