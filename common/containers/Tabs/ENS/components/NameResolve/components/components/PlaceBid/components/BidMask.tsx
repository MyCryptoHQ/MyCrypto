import * as React from 'react';

interface Props {
  hasUnitDropdown?: boolean;
  value: string;
  onChange(ev: React.FormEvent<HTMLInputElement>);
}

export class BidMask extends React.Component<Props> {
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
            value={this.props.value}
            onChange={this.props.onChange}
            placeholder="1.0"
          />
        </section>
      </section>
    );
  }
}
