import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { bindActionCreators } from 'redux';

class BidMaskClass extends React.Component<any, any> {
  public state = {
    value: ''
  };

  public onChange = e => {
    this.setState({
      value: e.target.value
    });
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  };

  public render() {
    return (
      <section className="form-group">
        <label>Bid Mask</label>
        <em className="col-xs-12">
          <small>
            This is the amount of ETH you send when placing your bid. It has no bearing on the
            *actual* amount you bid (above). It is simply to hide your real bid amount. It must be
            >= to your actual bid.
          </small>
        </em>
        <section className="input-group col-xs-12">
          <input
            type="number"
            className="form-control is-invalid"
            value={this.state.value}
            onChange={this.onChange}
            placeholder="1.0"
          />
        </section>
      </section>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export const BidMask = connect(mapStateToProps, mapDispatchToProps)(BidMaskClass);
