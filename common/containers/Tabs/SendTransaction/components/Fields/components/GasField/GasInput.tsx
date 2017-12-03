import React from 'react';
import translate from 'translations';
import { Query, GetTransactionFields } from 'components/renderCbs';
import { Aux } from 'components/ui';

interface Props {
  onChange(value: React.FormEvent<HTMLInputElement>): void;
}

export const GasInput: React.SFC<Props> = ({ onChange }) => (
  <Aux>
    <label>{translate('TRANS_gas')} </label>
    <GetTransactionFields
      withFieldValues={({ gasLimit: { raw, valid } }) => (
        <Query
          params={['readOnly']}
          withQuery={({ readOnly }) => (
            <input
              className={`form-control ${valid ? 'is-valid' : 'is-invalid'}`}
              type="text"
              readOnly={!!readOnly}
              value={raw}
              onChange={onChange}
            />
          )}
        />
      )}
    />
  </Aux>
);
