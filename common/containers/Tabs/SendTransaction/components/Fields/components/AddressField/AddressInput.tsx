import React from 'react';
import { Identicon, Aux } from 'components/ui';
import translate from 'translations';
//import { EnsAddress } from './components';
import { Query } from 'components/renderCbs';
import { donationAddressMap } from 'config/data';

interface Props {
  value: string;
  validAddress: boolean;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

//TODO: ENS handling
export const AddressInput: React.SFC<Props> = ({
  onChange,
  validAddress,
  value
}) => (
  <Aux>
    <label>{translate('SEND_addr')}:</label>
    <Query
      params={['readOnly']}
      withQuery={({ readOnly }) => (
        <input
          className={`form-control ${validAddress ? 'is-valid' : 'is-invalid'}`}
          type="text"
          value={value}
          placeholder={donationAddressMap.ETH}
          readOnly={!!readOnly}
          onChange={onChange}
        />
      )}
    />
    {/*<EnsAddress ensAddress={ensAddress} />*/}

    <div className="col-xs-1" style={{ padding: 0 }}>
      <Identicon address={/*ensAddress ||*/ value} />
    </div>
  </Aux>
);
