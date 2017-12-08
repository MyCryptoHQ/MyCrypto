import React, { Component } from 'react';
import { Expandable, ExpandHandler } from 'components/ui';
import { Query } from 'components/renderCbs';
import translate from 'translations';
import { donationAddressMap } from 'config/data';
import { getData } from 'selectors/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

interface OwnProps {
  onChange(ev: React.FormEvent<HTMLInputElement>);
}
interface StateProps {
  data: AppState['transaction']['fields']['data'];
}

type Props = OwnProps & StateProps;

const expander = (expandHandler: ExpandHandler) => (
  <a onClick={expandHandler}>
    <p className="strong">{translate('TRANS_advanced')}</p>
  </a>
);

class DataInputClass extends Component<Props> {
  public render() {
    const { data: { raw, value }, onChange } = this.props;
    return (
      <Expandable expandLabel={expander}>
        <div className="form-group">
          <label>{translate('TRANS_data')}</label>
          <Query
            params={['readOnly']}
            withQuery={({ readOnly }) => (
              <input
                className={`form-control ${!!value ? 'is-valid' : 'is-invalid'}`}
                type="text"
                placeholder={donationAddressMap.ETH}
                value={raw}
                readOnly={!!readOnly}
                onChange={onChange}
              />
            )}
          />
        </div>
      </Expandable>
    );
  }
}

export const DataInput = connect((state: AppState) => ({ data: getData(state) }))(DataInputClass);
