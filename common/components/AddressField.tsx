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
  showLabelMatch?: boolean;
}

export const AddressField: React.SFC<Props> = ({
  isReadOnly,
  isSelfAddress,
  isCheckSummed,
  showLabelMatch
}) => (
  <AddressFieldFactory
    isSelfAddress={isSelfAddress}
    showLabelMatch={showLabelMatch}
    withProps={({ currentTo, isValid, isLabelEntry, onChange, onFocus, onBlur, readOnly }) => (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">
            {translate(isSelfAddress ? 'X_ADDRESS' : 'SEND_ADDR')}
          </div>
          <Input
            className={`input-group-input ${!isValid && !isLabelEntry ? 'invalid' : ''}`}
            isValid={isValid}
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
    )}
  />
);
