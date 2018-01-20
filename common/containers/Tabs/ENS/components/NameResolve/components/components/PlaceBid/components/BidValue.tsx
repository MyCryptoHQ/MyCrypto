import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { inputBidValueField, TInputBidValueField } from 'actions/ens';
import { getBidValue } from 'selectors/ens';

interface StateProps {
  bidValue: AppState['ens']['fields']['bidValue'];
}

interface OwnProps {
  inputBidValueField: TInputBidValueField;
}

type Props = StateProps & OwnProps;

class BidValueClass extends React.Component<Props> {
  public onChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.inputBidValueField(e.currentTarget.value);
  };

  public render() {
    return (
      <section className="form-group">
        <label>Bid</label>
        <em className="col-xs-12">
          <small>You must remember this to claim your name later.</small>
        </em>
        <section className="input-group col-xs-12">
          <input
            type="number"
            className={`form-control ${!this.props.bidValue.value ? 'is-valid' : 'is-invalid'}`}
            onChange={this.onChange}
            value={this.props.bidValue.raw}
          />
        </section>
      </section>
    );
  }
}

export const BidValue = connect((state: AppState) => ({ bidValue: getBidValue(state) }), {
  inputBidValueField
})(BidValueClass);
