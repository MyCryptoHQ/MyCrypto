import React from 'react';

import { donationAddressMap } from 'config';
import translate from 'translations';
import { Input } from 'components/ui';
import { DataFieldFactory } from './DataFieldFactory';

export const DataField: React.SFC<{}> = () => (
  <DataFieldFactory
    withProps={({ data: { raw }, dataExists, onChange, readOnly }) => (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">{translate('OFFLINE_STEP2_LABEL_6')}</div>
          <Input
            className={dataExists ? 'is-valid' : 'is-invalid'}
            type="text"
            placeholder={donationAddressMap.ETH}
            value={raw}
            readOnly={!!readOnly}
            onChange={onChange}
          />
        </label>
      </div>
    )}
  />
);
