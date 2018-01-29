import React, { Component } from 'react';
import { getBidModalFields, ModalFields } from 'selectors/ens';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getNodeConfig } from 'selectors/config';
import { getFrom } from 'selectors/transaction';
import { makeBlob } from 'utils/blob';

import moment from 'moment';
import { EnsUserDownloadedBidAction } from 'actions/ens';

const MonoTd = ({ children }) => <td className="mono">{children}</td>;

export const ModalHeader = (
  <div className="Auction-warning">
    <strong>
      <h4>Screenshot & Save</h4>
    </strong>
    You cannot claim your name unless you have this information during the reveal process.
  </div>
);

interface OwnProps {
  userDownloadedBid(unsealDetails: EnsUserDownloadedBidAction['payload']): void;
}

interface StateProps extends ModalFields {
  node: AppState['config']['node'];
  from: AppState['transaction']['meta']['from'];
}

type Props = StateProps & OwnProps;

class DetailsClass extends Component<Props> {
  private currentDate = Date.now();
  public render() {
    const { bidMask, bidValue, endDate, secretPhrase, revealDate, node, name, from } = this.props;
    return (
      <div className="table-wrapper">
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>Name: </td>
              <MonoTd>{name}.eth</MonoTd>
            </tr>
            <tr>
              <td>Bid: </td>
              <MonoTd>{bidValue}</MonoTd>
            </tr>
            <tr>
              <td>Bid Mask:</td>
              <MonoTd>{bidMask}</MonoTd>
            </tr>
            <tr>
              <td>Secret Phrase:</td>
              <MonoTd>{secretPhrase}</MonoTd>
            </tr>
            <tr>
              <td>From:</td>
              <MonoTd>{from}</MonoTd>
            </tr>
            <tr>
              <td>Reveal Date:</td>
              <MonoTd>{revealDate}</MonoTd>
            </tr>
            <tr>
              <td>Auction Ends:</td>
              <MonoTd>
                <span>{endDate}</span>
              </MonoTd>
            </tr>
          </tbody>
        </table>
        {/* use css not br's */}
        <br />
        <p>Click here to save this as a file:</p>
        <a
          href={this.getBlob()}
          download={this.generateFileName()}
          onClick={() => this.props.userDownloadedBid(this.generateBidPayload())}
        >
          <textarea
            rows={6}
            className="form-control"
            readOnly={true}
            value={JSON.stringify(this.generateBidPayload(), null, 1)}
          />
        </a>

        <div className="BidModal-details-detail text-center">
          You are interacting with the <strong>{node.network}</strong> network provided by{' '}
          <strong>{node.service}</strong>
        </div>
      </div>
    );
  }

  private generateFileName = () =>
    `ENSBid-${this.props.from}-${moment(this.currentDate).format(
      'dddd, MMMM Do YYYY, h:mm:ss a'
    )}-${this.props.unsealDetails.name}`;

  private generateBidPayload = (): EnsUserDownloadedBidAction['payload'] => ({
    from: this.props.from!,
    ...this.props.unsealDetails,
    date: this.currentDate
  });

  private getBlob = () => makeBlob('text/json;charset=UTF-8', this.generateBidPayload());
}

const mapStateToProps = (state: AppState): StateProps => ({
  node: getNodeConfig(state),
  from: getFrom(state),
  ...getBidModalFields(state)
});
export const Details = connect(mapStateToProps)(DetailsClass);
