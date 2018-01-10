import * as React from 'react';
import { isValidAmount } from 'selectors/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

interface StateProps {
  isValid: boolean;
}

interface OwnProps {
  value: string;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

type Props = StateProps & OwnProps;

class BidValueClass extends React.Component<Props> {
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
            value={this.props.value}
            onChange={this.props.onChange}
          />
        </section>
      </section>
    );
  }
}

export const BidValue = connect((state: AppState) => ({ isValid: isValidAmount(state) }))(
  BidValueClass
);
