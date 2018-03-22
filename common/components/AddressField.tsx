import React from 'react';
import { AddressFieldFactory } from './AddressFieldFactory';
import { donationAddressMap } from 'config';
import translate from 'translations';
import { Input } from 'components/ui';

interface Props {
  isReadOnly?: boolean;
}

export const AddressField: React.SFC<Props> = ({ isReadOnly }) => (
  <AddressFieldFactory
    withProps={({ currentTo, isValid, onChange, readOnly }) => (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">{translate('SEND_ADDR_SHORT')}</div>
          <Input
            className={`input-group-input ${isValid ? '' : 'invalid'}`}
            type="text"
            value={currentTo.raw}
            placeholder={donationAddressMap.ETH}
            readOnly={!!(isReadOnly || readOnly)}
            spellCheck={false}
            onChange={onChange}
          />
        </label>
      </div>
    )}
  />
);
