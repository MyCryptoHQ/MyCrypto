import * as React from 'react';
import { isValidAmount } from 'selectors/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { setBidValueField, TSetBidValueField } from 'actions/ens';

interface StateProps {
  isValid: boolean;
}

interface OwnProps {
  setBidField: TSetBidValueField;
}

type Props = StateProps & OwnProps;

class BidValueClass extends React.Component<Props> {
  public onChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.setBidField(e.currentTarget.value);
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
            className={`form-control ${this.props.isValid ? 'is-valid' : 'is-invalid'}`}
            onChange={this.onChange}
          />
        </section>
      </section>
    );
  }
}

export const BidValue = connect((state: AppState) => ({ isValid: isValidAmount(state) }), {
  setBidValueField
})(BidValueClass);
