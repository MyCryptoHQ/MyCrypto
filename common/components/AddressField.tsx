import React from 'react';
import { AddressFieldFactory } from './AddressFieldFactory';
import { donationAddressMap } from 'config/data';

interface Props {
  isReadOnly?: boolean;
}

export const AddressField: React.SFC<Props> = ({ isReadOnly }) => (
  <AddressFieldFactory
    withProps={({ currentTo, isValid, onChange, readOnly }) => (
      <React.Fragment>
        <input
          className={`form-control ${isValid ? 'is-valid' : 'is-invalid'}`}
          type="text"
          value={currentTo.raw}
          placeholder={donationAddressMap.ETH}
          readOnly={!!(isReadOnly || readOnly)}
          onChange={onChange}
        />
      </React.Fragment>
    )}
  />
);
