import React from 'react';
import { AddressFieldFactory } from './AddressFieldFactory';
import { donationAddressMap } from 'config/data';

export const AddressField: React.SFC<{}> = () => (
  <AddressFieldFactory
    withProps={({ currentTo, isValid, onChange, readOnly }) => (
      <input
        className={`form-control ${isValid ? 'is-valid' : 'is-invalid'}`}
        type="text"
        value={currentTo.raw}
        placeholder={donationAddressMap.ETH}
        readOnly={!!readOnly}
        onChange={onChange}
      />
    )}
  />
);
