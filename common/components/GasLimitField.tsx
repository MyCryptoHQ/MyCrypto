import React from 'react';
import { GasLimitFieldFactory } from './GasLimitFieldFactory';
import translate from 'translations';
import { gasLimitValidator } from 'libs/validators';
import { InlineSpinner } from 'components/ui/InlineSpinner';
import './GasLimitField.scss';

interface Props {
  customLabel?: string;
  disabled?: boolean;
}

export const GasLimitField: React.SFC<Props> = ({ customLabel, disabled }) => (
  <GasLimitFieldFactory
    withProps={({ gasLimit: { raw }, onChange, readOnly, gasEstimationPending }) => (
      <React.Fragment>
        <div className="gaslimit-label-wrapper flex-wrapper">
          {customLabel ? <label>{customLabel} </label> : <label>{translate('TRANS_gas')} </label>}
          <div className="flex-spacer" />
          <InlineSpinner active={gasEstimationPending} text="Calculating" />
        </div>
        <input
          className={`form-control ${gasLimitValidator(raw) ? 'is-valid' : 'is-invalid'}`}
          type="number"
          placeholder="e.g. 21000"
          readOnly={!!readOnly}
          value={raw}
          onChange={onChange}
          disabled={disabled}
        />
      </React.Fragment>
    )}
  />
);
