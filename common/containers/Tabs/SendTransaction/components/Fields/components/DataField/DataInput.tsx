import React from 'react';
import { Expandable, ExpandHandler } from 'components/ui';
import { Query } from 'components/renderCbs';
import translate from 'translations';
import { donationAddressMap } from 'config/data';

interface Props {
  value: string;
  validData: boolean;
  onChange(ev: React.FormEvent<HTMLInputElement>);
}

const expander = (expandHandler: ExpandHandler) => (
  <a onClick={expandHandler}>
    <p className="strong">{translate('TRANS_advanced')}</p>
  </a>
);

export const DataInput: React.SFC<Props> = ({ onChange, value, validData }) => (
  <Expandable expandLabel={expander}>
    <div className="form-group">
      <label>{translate('TRANS_data')}</label>
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) => (
          <input
            className={`form-control ${validData ? 'is-valid' : 'is-invalid'}`}
            type="text"
            placeholder={donationAddressMap.ETH}
            value={value}
            readOnly={!!readOnly}
            onChange={onChange}
          />
        )}
      />
    </div>
  </Expandable>
);

/*
* <div className="row form-group">
<div className="col-sm-11 clearfix">
* </div>
</div >
*/
