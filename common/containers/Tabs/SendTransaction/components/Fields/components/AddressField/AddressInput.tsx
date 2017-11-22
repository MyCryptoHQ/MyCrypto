import React from 'react';
import { Identicon } from 'components/ui';
import translate from 'translations';
//import { EnsAddress } from './components';
import { Query, GetTransactionFields } from 'components/renderCbs';
import { donationAddressMap } from 'config/data';

interface Props {
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

//TODO: ENS handling
export const AddressInput: React.SFC<Props> = ({ onChange }) => (
  <GetTransactionFields
    withFieldValues={({ to: { raw, valid } }) => (
      <div className="row form-group">
        <div className="col-xs-11">
          <label>{translate('SEND_addr')}:</label>
          <Query
            params={['readOnly']}
            withQuery={({ readOnly }) => (
              <input
                className={`form-control ${valid ? 'is-valid' : 'is-invalid'}`}
                type="text"
                value={raw}
                placeholder={donationAddressMap.ETH}
                readOnly={!!readOnly}
                onChange={onChange}
              />
            )}
          />
          {/*<EnsAddress ensAddress={ensAddress} />*/}
        </div>
        <div className="col-xs-1" style={{ padding: 0 }}>
          <Identicon address={/*ensAddress ||*/ raw} />
        </div>
      </div>
    )}
  />
);
