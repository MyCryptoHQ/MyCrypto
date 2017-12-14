import { DataFieldFactory } from './DataFieldFactory';
import React from 'react';
import { Expandable, ExpandHandler } from 'components/ui';
import translate from 'translations';
import { donationAddressMap } from 'config/data';

const expander = (expandHandler: ExpandHandler) => (
  <a onClick={expandHandler}>
    <p className="strong">{translate('TRANS_advanced')}</p>
  </a>
);

export const DataField: React.SFC<{}> = () => (
  <DataFieldFactory
    withProps={({ data: { raw }, dataExists, onChange, readOnly }) => (
      <Expandable expandLabel={expander}>
        <div className="form-group">
          <label>{translate('TRANS_data')}</label>

          <input
            className={`form-control ${dataExists ? 'is-valid' : 'is-invalid'}`}
            type="text"
            placeholder={donationAddressMap.ETH}
            value={raw}
            readOnly={!!readOnly}
            onChange={onChange}
          />
        </div>
      </Expandable>
    )}
  />
);
