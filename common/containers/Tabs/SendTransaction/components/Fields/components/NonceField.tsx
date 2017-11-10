import React from 'react';
import Help from 'components/ui/Help';
import { isPositiveInteger } from 'utils/helpers';
import { ConditionalInput } from 'components/ui';

interface Props {
  placeholder: string;
  value: number | null | undefined;
  readOnly: boolean;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

const isValidNonce = (value: string | null | undefined) => {
  let valid;
  if (value === '0') {
    valid = true;
  } else if (!value) {
    valid = false;
  } else {
    valid = isPositiveInteger(parseInt(value, 10));
  }
  return valid;
};

export const NonceField: React.StatelessComponent<Props> = props => {
  const { placeholder, value, onChange, readOnly } = props;
  const strValue = value ? value.toString() : '';
  return (
    <div className="row form-group">
      <div className="col-xs-11">
        <Help
          size={'small'}
          link={
            'https://myetherwallet.github.io/knowledge-base/transactions/what-is-nonce.html'
          }
        />
        <label>Nonce</label>
        <ConditionalInput
          className={`form-control ${
            isValidNonce(strValue) ? 'is-valid' : 'is-invalid'
          }`}
          type="number"
          value={strValue}
          placeholder={placeholder}
          condition={readOnly}
          conditionalProps={{ onChange }}
        />
      </div>
    </div>
  );
};
