import React from 'react';
import translate from 'translations';
import { Query } from 'components/renderCbs';
import { Aux } from 'components/ui';

interface Props {
  value: string;
  validGas: boolean;
  onChange(value: React.FormEvent<HTMLInputElement>): void;
}

export const GasInput: React.SFC<Props> = ({ value, onChange, validGas }) => (
  <Aux>
    <label>{translate('TRANS_gas')} </label>

    <Query
      params={['readOnly']}
      withQuery={({ readOnly }) => (
        <input
          className={`form-control ${validGas ? 'is-valid' : 'is-invalid'}`}
          type="text"
          readOnly={!!readOnly}
          value={value}
          onChange={onChange}
        />
      )}
    />
  </Aux>
);

/*
  <div className="row form-group">
    <div className="col-sm-11 clearfix">
     </div>
  </div>

*/
