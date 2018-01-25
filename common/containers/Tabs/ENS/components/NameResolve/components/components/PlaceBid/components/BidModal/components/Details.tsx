import React, { Component } from 'react';
import { getBidModalFields, ModalFields } from 'selectors/ens';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getNodeConfig } from 'selectors/config';
import { From } from 'components/ConfirmationModal/components/From';

const MonoTd = ({ children }) => <td className="mono">{children}</td>;

export const ModalHeader = (
  <div className="Auction-warning">
    <strong>
      <h4>Screenshot & Save</h4>
    </strong>
    You cannot claim your name unless you have this information during the reveal process.
  </div>
);

interface StateProps extends ModalFields {
  node: AppState['config']['node'];
}

class DetailsClass extends Component<StateProps> {
  public render() {
    const { bidMask, bidValue, endDate, secretPhrase, revealDate, node, name } = this.props;
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

              <MonoTd>
                <From withFrom={from => <>{from}</>} />
              </MonoTd>
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
        <p>Copy and save this:</p>
        <textarea className="form-control" readOnly={true} value={JSON.stringify('transaction')} />

        <div className="BidModal-details-detail text-center">
          You are interacting with the <strong>{node.network}</strong> network provided by{' '}
          <strong>{node.service}</strong>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  node: getNodeConfig(state),
  ...getBidModalFields(state)
});
export const Details = connect(mapStateToProps)(DetailsClass);
