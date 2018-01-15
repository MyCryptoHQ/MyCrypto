import { DataFieldFactory } from './DataFieldFactory';
import React from 'react';
import translate from 'translations';
import { donationAddressMap } from 'config/data';

export const DataField: React.SFC<{}> = () => (
  <DataFieldFactory
    withProps={({ data: { raw }, dataExists, onChange, readOnly }) => (
      <>
        <label>{translate('OFFLINE_Step2_Label_6')}</label>
        <input
          className={`form-control ${dataExists ? 'is-valid' : 'is-invalid'}`}
          type="text"
          placeholder={donationAddressMap.ETH}
          value={raw}
          readOnly={!!readOnly}
          onChange={onChange}
        />
      </>
    )}
  />
);
