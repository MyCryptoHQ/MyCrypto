import { Aux } from 'components/ui';
import * as React from 'react';
import translate, { translateRaw } from 'translations';
import { Query, CurrentValue } from 'components/renderCbs';

interface Props {
  onChange(ev: React.FormEvent<HTMLInputElement>);
}

export const AmountInput: React.SFC<Props> = ({ onChange }) => (
  <Query
    params={['readOnly']}
    withQuery={({ readOnly }) => (
      <Aux>
        <label>{translate('SEND_amount')}</label>
        <CurrentValue
          withValue={({ value }) => (
            <input
              className={`form-control ${
                !!value.value ? 'is-valid' : 'is-invalid'
              }`}
              type="text"
              placeholder={translateRaw('SEND_amount_short')}
              value={value.raw}
              readOnly={!!readOnly}
              onChange={onChange}
            />
          )}
        />
      </Aux>
    )}
  />
);
