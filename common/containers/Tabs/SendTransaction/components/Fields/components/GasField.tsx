import React from 'react';
import translate from 'translations';
import { ConditionalInput } from 'components/ui';

interface Props {
  value: string;
  readOnly: boolean;
  onChange(value: string): void;
}

const GasField: React.StatelessComponent<Props> = props => {
  const { value, onChange, readOnly } = props;
  const validInput = isFinite(parseFloat(value)) && parseFloat(value) > 0;

  return (
    <div className="row form-group">
      <div className="col-sm-11 clearfix">
        <label>{translate('TRANS_gas')} </label>
        <ConditionalInput
          className={`form-control ${validInput ? 'is-valid' : 'is-invalid'}`}
          type="text"
          disabled={readOnly}
          value={value}
          condition={readOnly}
          conditionalProps={{ onChange }}
        />
      </div>
    </div>
  );
};

GasField.defaultProps = { value: '21000' };

export { GasField };
