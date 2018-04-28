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
  network: NetworkConfig;
}

export const AddressField: React.SFC<Props> = ({
  isReadOnly,
  isSelfAddress,
  isCheckSummed,
  network
}) => (
  <AddressFieldFactory
    isSelfAddress={isSelfAddress}
    withProps={({ currentTo, isValid, onChange, readOnly }) => (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">
            {translate(isSelfAddress ? 'X_ADDRESS' : 'SEND_ADDR')}
          </div>
          <Input
            className={`input-group-input ${isValid ? '' : 'invalid'}`}
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
          />
        </label>
      </div>
    )}
    chainId={network.chainId}
  />
);
