import React, { Component } from 'react';
import { Address, Button, Network } from '@mycrypto/ui';

import { Amount } from 'v2/components';
import { ISendState } from '../types';
import './ConfirmTransaction.scss';

// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';
import feeIcon from 'common/assets/images/icn-fee.svg';
import { AddressMetadataContext } from 'v2/providers';

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

// export default function createConfirmTransactionComponent(outterProps: Pick<Props, 'onNext'>) {
//   return (props: Pick<Props, 'stateValues'>) => {
//     return <ConfirmTransaction onNext={outterProps.onNext} stateValues={props.stateValues} />;
//   };
// }

export default class ConfirmTransaction extends Component<Props> {
  public state: State = {
    showingDetails: false
  };

  public render() {
    const {
      stateValues: {
        transactionFields: { senderAddress, recipientAddress }
      },
      onNext
    } = this.props;
    const { showingDetails } = this.state;

    return (
      <div className="ConfirmTransaction">
        <AddressMetadataContext.Consumer>
          {({ addressMetadata }) => {
            let recipientLabel: string = 'Unknown';
            let senderLabel: string = 'Unknown';
            addressMetadata.map(en => {
              if (en.address.toLowerCase() === recipientAddress.toLowerCase()) {
                recipientLabel = en.label;
              }
              if (en.address.toLowerCase() === senderAddress.toLowerCase()) {
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
                    <Address address={senderAddress} title={senderLabel} truncate={truncate} />
                  </div>
                </div>
              </div>
            );
          }}
        </AddressMetadataContext.Consumer>
        <div className="ConfirmTransaction-row">
          <div className="ConfirmTransaction-row-column">
            <img src={sendIcon} alt="Send" /> Send Amount:
          </div>
          <div className="ConfirmTransaction-row-column">
            <Amount assetValue="13.2343 ETH" fiatValue="$12,000.00" />
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
            <Amount assetValue="13.2434662 ETH" fiatValue="$12,000.21" />
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
