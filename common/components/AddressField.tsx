import React from 'react';
import { connect } from 'react-redux';

import { donationAddressMap } from 'config';
import translate from 'translations';
import { AppState } from 'features/reducers';
import { getChecksumAddressFn } from 'features/config';
import { Input } from 'components/ui';
import { AddressFieldFactory } from './AddressFieldFactory';

interface OwnProps {
  isReadOnly?: boolean;
  isSelfAddress?: boolean;
  isCheckSummed?: boolean;
  showLabelMatch?: boolean;
}

interface StateProps {
  toChecksumAddress: ReturnType<typeof getChecksumAddressFn>;
}

type Props = OwnProps & StateProps;

const AddressField: React.SFC<Props> = ({
  isReadOnly,
  isSelfAddress,
  isCheckSummed,
  showLabelMatch,
  toChecksumAddress
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

export default connect((state: AppState): StateProps => ({
  toChecksumAddress: getChecksumAddressFn(state)
}))(AddressField);
