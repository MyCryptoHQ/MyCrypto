import { DataFieldFactory } from './DataFieldFactory';
import React from 'react';
import translate from 'translations';
import { donationAddressMap } from 'config';
import { Input } from 'components/ui';

export const DataField: React.SFC<{}> = () => (
  <DataFieldFactory
    withProps={({ data: { raw }, validData, onChange, readOnly }) => (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">{translate('OFFLINE_STEP2_LABEL_6')}</div>
          <Input
            isValid={validData}
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
