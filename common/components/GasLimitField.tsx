import React from 'react';
import { GasLimitFieldFactory } from './GasLimitFieldFactory';
import translate from 'translations';
import { gasLimitValidator } from 'libs/validators';
import { InlineSpinner } from 'components/ui/InlineSpinner';
import './GasLimitField.scss';
import { Input } from 'components/ui';

interface Props {
  customLabel?: string;
  disabled?: boolean;
}

export const GasLimitField: React.SFC<Props> = ({ customLabel, disabled }) => (
  <GasLimitFieldFactory
    withProps={({ gasLimit: { raw }, onChange, readOnly, gasEstimationPending }) => (
      <div className="input-group-wrapper AdvancedGas-gas-price">
        <label className="input-group">
          <div className="input-group-header">
            {customLabel ? customLabel : translate('TRANS_gas')}
            <div className="flex-spacer" />
            <InlineSpinner active={gasEstimationPending} text="Calculating" />
          </div>
          <Input
            className={gasLimitValidator(raw) ? 'is-valid' : 'is-invalid'}
            type="number"
            placeholder="e.g. 21000"
            readOnly={!!readOnly}
            value={raw}
            onChange={onChange}
            disabled={disabled}
          />
        </label>
      </div>
    )}
  />
);
