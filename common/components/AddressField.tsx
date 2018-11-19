import React from 'react';
import { connect } from 'react-redux';

import { donationAddressMap } from 'config';
import translate from 'translations';
import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';
import { Input } from 'components/ui';
import { AddressFieldFactory } from './AddressFieldFactory';

interface OwnProps {
  isReadOnly?: boolean;
  isSelfAddress?: boolean;
  isCheckSummed?: boolean;
  showLabelMatch?: boolean;
  showIdenticon?: boolean;
  showInputLabel?: boolean;
  placeholder?: string;
  value?: string;
  dropdownThreshold?: number;
  onChangeOverride?(ev: React.FormEvent<HTMLInputElement>): void;
}

interface StateProps {
  toChecksumAddress: ReturnType<typeof configSelectors.getChecksumAddressFn>;
}

type Props = OwnProps & StateProps;

const AddressField: React.SFC<Props> = ({
  isReadOnly,
  isSelfAddress,
  isCheckSummed,
  showLabelMatch,
  toChecksumAddress,
  showIdenticon,
  placeholder = donationAddressMap.ETH,
  showInputLabel = true,
  onChangeOverride,
  value,
  dropdownThreshold
}) => (
  <AddressFieldFactory
    isSelfAddress={isSelfAddress}
    showLabelMatch={showLabelMatch}
    showIdenticon={showIdenticon}
    onChangeOverride={onChangeOverride}
    value={value}
    dropdownThreshold={dropdownThreshold}
    withProps={({ currentTo, isValid, isLabelEntry, onChange, onFocus, onBlur, readOnly }) => (
      <div className="input-group-wrapper">
        <label className="input-group">
          {showInputLabel && (
            <div className="input-group-header">
              {translate(isSelfAddress ? 'X_ADDRESS' : 'SEND_ADDR')}
            </div>
          )}
          <Input
            className={`input-group-input ${!isValid && !isLabelEntry ? 'invalid' : ''}`}
            isValid={isValid}
            type="text"
            value={(value != null
              ? value
              : isCheckSummed ? toChecksumAddress(currentTo.raw) : currentTo.raw
            ).trim()}
            placeholder={placeholder}
            readOnly={!!(isReadOnly || readOnly)}
            spellCheck={false}
            onChange={onChangeOverride || onChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </label>
      </div>
    )}
  />
);

export default connect((state: AppState): StateProps => ({
  toChecksumAddress: configSelectors.getChecksumAddressFn(state)
}))(AddressField);
