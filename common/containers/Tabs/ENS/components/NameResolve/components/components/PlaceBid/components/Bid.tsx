import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { bindActionCreators } from 'redux';
import { setCurrentValue } from 'actions/transaction';
import { UnitDropDown } from 'components';

interface Props {
  // Actions
  setCurrentValue: any;
  // Props
  hasUnitDropdown?: boolean;
}

class BidClass extends React.Component<Props, any> {
  public state = {
    value: ''
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

const mapStateToProps = (state: AppState) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setCurrentValue }, dispatch);
};

export const Bid = connect(mapStateToProps, mapDispatchToProps)(BidClass);
