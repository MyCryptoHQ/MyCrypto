import React, { Component } from 'react';
import { Address, Button, Network } from '@mycrypto/ui';

import { Amount } from 'v2/components';
import './ConfirmTransaction.scss';

// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';
import feeIcon from 'common/assets/images/icn-fee.svg';
import { AddressBookContext } from 'v2/services/Store';
import { ISendState } from '../types';

interface Props {
  stateValues: ISendState;
  onNext(): void;
}

interface State {
  showingDetails: boolean;
}

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

export default class ConfirmTransaction extends Component<Props> {
  public state: State = {
    showingDetails: false
  };

  public render() {
    const {
      stateValues: { transactionFields: { recipientAddress, amount, asset, account: { address } } },
      onNext
    } = this.props;
    const { showingDetails } = this.state;

    return (
      <div className="ConfirmTransaction">
        <AddressBookContext.Consumer>
          {({ addressBook }) => {
            let recipientLabel: string = 'Unknown Account';
            let senderLabel: string | undefined = 'Unknown Account';
            addressBook.map(en => {
              if (en.address.toLowerCase() === recipientAddress.toLowerCase()) {
                recipientLabel = en.label;
              }
              if (en.address.toLowerCase() === address.toLowerCase()) {
                senderLabel = en.label;
              }
            });
            return (
              <div className="ConfirmTransaction-row">
                <div className="ConfirmTransaction-row-column">
                  To:
                  <div className="ConfirmTransaction-addressWrapper">
                    <Address
                      address={recipientAddress}
                      title={recipientLabel}
                      truncate={truncate}
                    />
                  </div>
                </div>
                <div className="ConfirmTransaction-row-column">
                  From:
                  <div className="ConfirmTransaction-addressWrapper">
                    <Address address={address} title={senderLabel} truncate={truncate} />
                  </div>
                </div>
              </div>
            );
          }}
        </AddressBookContext.Consumer>
        <div className="ConfirmTransaction-row">
          <div className="ConfirmTransaction-row-column">
            <img src={sendIcon} alt="Send" /> Send Amount:
          </div>
          <div className="ConfirmTransaction-row-column">
            <Amount assetValue={amount} fiatValue="$12,000.00" />
          </div>
        </div>
        <div className="ConfirmTransaction-row">
          <div className="ConfirmTransaction-row-column">
            <img src={feeIcon} alt="Fee" /> Transaction Fee:
          </div>
          <div className="ConfirmTransaction-row-column">
            <Amount assetValue="0.000462 ETH" fiatValue="$0.21" />
          </div>
        </div>
        <div className="ConfirmTransaction-divider" />
        <div className="ConfirmTransaction-row">
          <div className="ConfirmTransaction-row-column">
            <img src={sendIcon} alt="Total" /> You'll Send:
          </div>
          <div className="ConfirmTransaction-row-column">
            <Amount assetValue={amount + asset} fiatValue="$12,000.21" />
          </div>
        </div>
        <Button
          basic={true}
          onClick={this.toggleShowingDetails}
          className="ConfirmTransaction-detailButton"
        >
          {showingDetails ? 'Hide' : 'Show'} Details
        </Button>
        {showingDetails && (
          <div className="ConfirmTransaction-details">
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Account Balance:</div>
              <div className="ConfirmTransaction-details-row-column">0.231935129 ETH</div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Network:</div>
              <div className="ConfirmTransaction-details-row-column">
                <Network color="blue">Ethereum</Network>
              </div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Gas Limit:</div>
              <div className="ConfirmTransaction-details-row-column">21000</div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Gas Price:</div>
              <div className="ConfirmTransaction-details-row-column">10 GWEI (0.00000001 ETH)</div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Max TX Fee:</div>
              <div className="ConfirmTransaction-details-row-column">0.00021 ETH (21000 GWEI)</div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Nonce:</div>
              <div className="ConfirmTransaction-details-row-column">57</div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Data:</div>
              <div className="ConfirmTransaction-details-row-column">(none)</div>
            </div>
          </div>
        )}
        <Button onClick={onNext} className="ConfirmTransaction-button">
          Confirm and Send
        </Button>
      </div>
    );
  }

  private toggleShowingDetails = () =>
    this.setState((prevState: State) => ({
      showingDetails: !prevState.showingDetails
    }));
}
