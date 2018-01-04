import * as React from 'react';
import { connect } from 'react-redux';
import { setCurrentValue, TSetCurrentValue } from 'actions/transaction';
import { UnitDropDown } from 'components';

interface Props {
  // Actions
  setCurrentValue: TSetCurrentValue;
  // Props
  hasUnitDropdown?: boolean;
}

interface State {
  value: number | '';
}

class BidClass extends React.Component<Props, State> {
  public state = {
    value: '' as ''
  };

  public onChange = e => {
    this.props.setCurrentValue(e.target.value);
    this.setState({
      value: e.target.value
    });
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
            className="form-control is-invalid"
            value={this.state.value}
            onChange={this.onChange}
            placeholder="1.0"
          />
          {this.props.hasUnitDropdown && <UnitDropDown />}
        </section>
      </section>
    );
  }
}

export const Bid = connect(null, { setCurrentValue })(BidClass);
