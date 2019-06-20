import { Address, Button, Network } from '@mycrypto/ui';
import feeIcon from 'common/assets/images/icn-fee.svg';
// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';
import { utils } from 'ethers';
import React, { Component } from 'react';
import { getNetworkByChainId } from 'v2';
import { Amount } from 'v2/components';
import { AddressBookContext } from 'v2/providers';
import { ISendState } from '../types';
import './ConfirmTransaction.scss';

interface Props {
  stateValues: ISendState;
  onNext(): void;
}

interface State {
  showingDetails: boolean;
  toAddressFromSignedTransaction: string;
  senderAddressFromSignedTransaction: string;
  amountToSendFromSignedTransaction: string;
  gasLimitFromSignedTransaction: number;
  gasPriceFromSignedTransaction: number;
  nonceFromSignedTransaction: number;
  networkFromSignedTransaction: string;
  dataFromSignedTransaction: string;
}

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

export default class ConfirmTransaction extends Component<Props> {
  public state: State = {
    showingDetails: false,
    toAddressFromSignedTransaction: '',
    senderAddressFromSignedTransaction: '',
    amountToSendFromSignedTransaction: '',
    gasLimitFromSignedTransaction: 0,
    gasPriceFromSignedTransaction: 0,
    nonceFromSignedTransaction: 0,
    networkFromSignedTransaction: '',
    dataFromSignedTransaction: ''
  };

  public decodeTransaction() {
    const decodedTranasction = utils.parseTransaction(
      this.props.stateValues.transactionFields.account.signedTransaction
    );

    if (!decodedTranasction) {
      return;
    } else {
      const toAddress = decodedTranasction.to;
      const fromAddress = decodedTranasction.from;
      const amountToSend = utils.formatEther(decodedTranasction.value).toString();
      const gasLimit = utils.formatEther(decodedTranasction.gasLimit);
      const gasPrice = utils.formatEther(decodedTranasction.gasPrice);
      const nonce = decodedTranasction.nonce;
      const data = decodedTranasction.data;

      console.log(decodedTranasction);

      this.setState({
        toAddressFromSignedTransaction: toAddress,
        senderAddressFromSignedTransaction: fromAddress,
        amountToSendFromSignedTransaction: amountToSend,
        gasLimitFromSignedTransaction: gasLimit,
        gasPriceWeiFromSignedTransaction: gasPrice,
        nonceFromSignedTransaction: nonce,

        dataFromSignedTransaction: data
      });
    }
    this.getNetworkFromSignedTransaction();
  }

  public async getNetworkFromSignedTransaction() {
    const decodedTranasction = utils.parseTransaction(
      this.props.stateValues.transactionFields.account.signedTransaction
    );
    const network = getNetworkByChainId(decodedTranasction.chainId.toString());
    if (network) {
      const networkName = network.name;
      this.setState({ networkFromSignedTransaction: networkName });
    }
  }

  public componentWillMount() {
    this.decodeTransaction();
  }

  public render() {
    const {
      stateValues: { transactionFields: { amount, asset, account: { label } } },
      onNext
    } = this.props;
    const {
      showingDetails,
      toAddressFromSignedTransaction,
      senderAddressFromSignedTransaction,
      amountToSendFromSignedTransaction,
      gasLimitFromSignedTransaction,
      gasPriceFromSignedTransaction,
      nonceFromSignedTransaction,
      networkFromSignedTransaction,
      dataFromSignedTransaction
    } = this.state;

    return (
      <div className="ConfirmTransaction">
        <AddressBookContext.Consumer>
          {({ addressBook }) => {
            let recipientLabel: string = 'Unknown';
            let senderLabel: string = label;
            addressBook.map(en => {
              if (en.address.toLowerCase() === toAddressFromSignedTransaction.toLowerCase()) {
                recipientLabel = en.label;
              }
              if (en.address.toLowerCase() === senderAddressFromSignedTransaction.toLowerCase()) {
                senderLabel = en.label;
              }
            });
            return (
              <div className="ConfirmTransaction-row">
                <div className="ConfirmTransaction-row-column">
                  To:
                  <div className="ConfirmTransaction-addressWrapper">
                    <Address
                      address={toAddressFromSignedTransaction}
                      title={recipientLabel}
                      truncate={truncate}
                    />
                  </div>
                </div>
                <div className="ConfirmTransaction-row-column">
                  From:
                  <div className="ConfirmTransaction-addressWrapper">
                    <Address
                      address={senderAddressFromSignedTransaction}
                      title={senderLabel}
                      truncate={truncate}
                    />
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
            <Amount assetValue={amountToSendFromSignedTransaction} fiatValue="$12,000.00" />
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
                <Network color="blue">{networkFromSignedTransaction}</Network>
              </div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Gas Limit:</div>
              <div className="ConfirmTransaction-details-row-column">
                {gasLimitFromSignedTransaction}
              </div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Gas Price:</div>
              <div className="ConfirmTransaction-details-row-column">
                {gasPriceFromSignedTransaction}
              </div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Max TX Fee:</div>
              <div className="ConfirmTransaction-details-row-column">
                {gasLimitFromSignedTransaction * gasPriceFromSignedTransaction}
              </div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Nonce:</div>
              <div className="ConfirmTransaction-details-row-column">
                {nonceFromSignedTransaction}
              </div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Data:</div>
              <div className="ConfirmTransaction-details-row-column">
                {dataFromSignedTransaction}
              </div>
            </div>
          </div>
        )}
        <Button onClick={onNext} className="ConfirmTransaction-button">
          Confirm and Send
        </Button>
      </div>
    );
  }

  // private sendTransaction() {}

  private toggleShowingDetails = () =>
    this.setState((prevState: State) => ({
      showingDetails: !prevState.showingDetails
    }));
}
