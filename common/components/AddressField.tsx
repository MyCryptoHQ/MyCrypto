import React from 'react';
import { AddressFieldFactory } from './AddressFieldFactory';
import { donationAddressMap } from 'config';
import translate from 'translations';
import { Input } from 'components/ui';
import { toChecksumAddress } from 'ethereumjs-util';

interface Props {
  isReadOnly?: boolean;
  isSelfAddress?: boolean;
  isCheckSummed?: boolean;
}

export const AddressField: React.SFC<Props> = ({ isReadOnly, isSelfAddress, isCheckSummed }) => (
  <AddressFieldFactory
    isSelfAddress={isSelfAddress}
    withProps={({ currentLabel, currentTo, isValid, onChange, onFocus, onBlur, readOnly }) => {
      let label;

      if (currentLabel && !isSelfAddress) {
        label = (
          <span>
            <i className="fa fa-check" /> {currentLabel}
          </span>
        );
      } else {
        label = translate(isSelfAddress ? 'X_ADDRESS' : 'SEND_ADDR');
      }

      return (
        <div className="input-group-wrapper">
          <label className="input-group">
            <div className="input-group-header">{label}</div>
            <Input
              className={`input-group-input ${isValid ? '' : 'invalid'}`}
              type="text"
              value={isCheckSummed ? toChecksumAddress(currentTo.raw) : currentTo.raw}
              placeholder={donationAddressMap.ETH}
              readOnly={!!(isReadOnly || readOnly)}
              spellCheck={false}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </label>
        </div>
      );
    }}
  />
);
