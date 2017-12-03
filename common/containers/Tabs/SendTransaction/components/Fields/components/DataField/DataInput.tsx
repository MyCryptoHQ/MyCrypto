import React from 'react';
import { Expandable, ExpandHandler } from 'components/ui';
import { Query, GetTransactionFields } from 'components/renderCbs';
import translate from 'translations';
import { donationAddressMap } from 'config/data';

interface Props {
  onChange(ev: React.FormEvent<HTMLInputElement>);
}

const expander = (expandHandler: ExpandHandler) => (
  <a onClick={expandHandler}>
    <p className="strong">{translate('TRANS_advanced')}</p>
  </a>
);

export const DataInput: React.SFC<Props> = ({ onChange }) => (
  <Expandable expandLabel={expander}>
    <div className="form-group">
      <label>{translate('TRANS_data')}</label>
      <GetTransactionFields
        withFieldValues={({ data: { raw, valid } }) => (
          <Query
            params={['readOnly']}
            withQuery={({ readOnly }) => (
              <input
                className={`form-control ${valid ? 'is-valid' : 'is-invalid'}`}
                type="text"
                placeholder={donationAddressMap.ETH}
                value={raw}
                readOnly={!!readOnly}
                onChange={onChange}
              />
            )}
          />
        )}
      />
    </div>
  </Expandable>
);
