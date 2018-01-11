import * as React from 'react';
import { setBidMaskField, TSetBidMaskField } from 'actions/ens';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getBidMask } from 'selectors/ens';

interface OwnProps {
  hasUnitDropdown?: boolean;
}

interface DispatchProps {
  setBidMaskField: TSetBidMaskField;
}

interface StateProps {
  bidMask: AppState['ens']['fields']['bidMask'];
}

type Props = OwnProps & DispatchProps & StateProps;

class BidMaskClass extends React.Component<Props> {
  public onChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.setBidMaskField(e.currentTarget.value);
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
            className="form-control"
            onChange={this.onChange}
            value={this.props.bidMask || ''}
            placeholder="1.0"
          />
        </section>
      </section>
    );
  }
}

export const BidMask = connect((state: AppState) => ({ bidMask: getBidMask(state) }), {
  setBidMaskField
})(BidMaskClass);
