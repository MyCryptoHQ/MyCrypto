import { Identicon, ConditionalInput } from 'components/ui';
import { isValidENSorEtherAddress } from 'libs/validators';
import { EnsAddress } from './components';
import React from 'react';
import translate from 'translations';

interface Props {
  placeholder: string;
  value: string;
  ensAddress: string | null;
  readOnly: boolean;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

//TODO: add ens resolving
export const AddressField: React.SFC<Props> = props => {
  const { placeholder, value, readOnly } = props;
  return (
    <div className="row form-group">
      <div className="col-xs-11">
        <label>{translate('SEND_addr')}:</label>
        <ConditionalInput
          className={`form-control ${
            isValidENSorEtherAddress(value) ? 'is-valid' : 'is-invalid'
          }`}
          type="text"
          value={value}
          placeholder={placeholder}
          disabled={readOnly}
          condition={readOnly}
          conditionalProps={{ onChange: props.onChange }}
        />
        <EnsAddress ensAddress={ensAddress} />
      </div>
      <div className="col-xs-1" style={{ padding: 0 }}>
        <Identicon address={ensAddress || value} />
      </div>
    </div>
  );
};
