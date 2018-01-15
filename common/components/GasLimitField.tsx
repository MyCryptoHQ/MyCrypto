import React from 'react';
import { GasLimitFieldFactory } from './GasLimitFieldFactory';
import translate from 'translations';
import { CSSTransition } from 'react-transition-group';
import { Spinner } from 'components/ui';

interface Props {
  includeLabel: boolean;
  onlyIncludeLoader: boolean;
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

export const GasLimitField: React.SFC<Props> = ({ includeLabel, onlyIncludeLoader }) => (
  <React.Fragment>
    {includeLabel ? <label>{translate('TRANS_gas')} </label> : null}

    <GasLimitFieldFactory
      withProps={({ gasLimit: { raw, value }, onChange, readOnly, gasEstimationPending }) => (
        <>
          <GaslimitLoading gasEstimationPending={gasEstimationPending} />
          {onlyIncludeLoader ? null : (
            <input
              className={`form-control ${!!value ? 'is-valid' : 'is-invalid'}`}
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
