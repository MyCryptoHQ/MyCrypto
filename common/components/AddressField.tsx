import React from 'react';
import { AddressFieldFactory } from './AddressFieldFactory';
import { donationAddressMap } from 'config';
import translate from 'translations';
import { Input } from 'components/ui';
import { toChecksumAddressByChainId } from 'libs/checksum';
import { NetworkConfig } from 'types/network';

interface Props {
  isReadOnly?: boolean;
  isSelfAddress?: boolean;
  isCheckSummed?: boolean;
  showLabelMatch?: boolean;
  network: NetworkConfig;
}

export const AddressField: React.SFC<Props> = ({
  isReadOnly,
  isSelfAddress,
  isCheckSummed,
  showLabelMatch,
  network
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
            value={
              isCheckSummed
                ? toChecksumAddressByChainId(currentTo.raw, network.chainId)
                : currentTo.raw
            }
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
