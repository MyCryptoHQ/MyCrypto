import React, { Component } from 'react';
import { Identicon } from 'components/ui';
import translate from 'translations';
//import { EnsAddress } from './components';
import { Query } from 'components/renderCbs';
import { donationAddressMap } from 'config/data';
import { ICurrentTo, getCurrentTo } from 'selectors/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

interface StateProps {
  currentTo: ICurrentTo;
}
interface OwnProps {
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

type Props = OwnProps & StateProps;

//TODO: ENS handling
class AddressInputClass extends Component<Props> {
  public render() {
    const { currentTo, onChange } = this.props;
    const { raw, value } = currentTo;
    return (
      <div className="row form-group">
        <div className="col-xs-11">
          <label>{translate('SEND_addr')}:</label>
          <Query
            params={['readOnly']}
            withQuery={({ readOnly }) => (
              <input
                className={`form-control ${!!value ? 'is-valid' : 'is-invalid'}`}
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
    );
  }
}

export const AddressInput = connect((state: AppState) => ({ currentTo: getCurrentTo(state) }))(
  AddressInputClass
);
