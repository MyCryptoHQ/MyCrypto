import { Address, Button, Network } from '@mycrypto/ui';
import feeIcon from 'common/assets/images/icn-fee.svg';
// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';
import { utils } from 'ethers';
import { FallbackProvider } from 'ethers/providers';
import React, { Component } from 'react';
import { getNetworkByChainId } from 'v2';
import { Amount } from 'v2/components';
import { allProviders } from 'v2/config/networks/globalProvider';
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
  gasLimitWeiFromSignedTransaction: string | number;
  gasPriceWeiFromSignedTransaction: string | number;
  nonceFromSignedTransaction: number;
  networkFromSignedTransaction: string;
  dataFromSignedTransaction: string;
  maxCostFeeEther: string;
  totalAmountEther: string;
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
    gasLimitWeiFromSignedTransaction: '',
    gasPriceWeiFromSignedTransaction: '',
    nonceFromSignedTransaction: 0,
    networkFromSignedTransaction: '',
    dataFromSignedTransaction: '',
    maxCostFeeEther: '',
    totalAmountEther: ''
  };

  public decodeTransaction() {
    const decodedTranasction = utils.parseTransaction(this.props.stateValues.signedTransaction);

    if (!decodedTranasction) {
      return;
    } else {
      const toAddress = decodedTranasction.to;
      const fromAddress = decodedTranasction.from;
      const gasLimitWei = utils.bigNumberify(decodedTranasction.gasLimit);
      const gasPriceWei = utils.bigNumberify(decodedTranasction.gasPrice);
      const nonce = decodedTranasction.nonce;
      const data = decodedTranasction.data;

      const amountToSendWei = utils.bigNumberify(decodedTranasction.value);
      const amountToSendEther = utils.formatEther(amountToSendWei);

      const maxCostWei = gasPriceWei.mul(gasLimitWei);
      const maxCostFeeEther = utils.formatEther(maxCostWei);

      const totalAmountWei = amountToSendWei.add(maxCostWei);
      const totalAmountEther = utils.formatEther(totalAmountWei);

      this.setState({
        toAddressFromSignedTransaction: toAddress,
        senderAddressFromSignedTransaction: fromAddress,
        amountToSendFromSignedTransaction: amountToSendEther.toString(),
        gasLimitWeiFromSignedTransaction: gasLimitWei.toString(),
        gasPriceWeiFromSignedTransaction: gasPriceWei.toString(),
        nonceFromSignedTransaction: nonce,
        dataFromSignedTransaction: data,
        maxCostFeeEther: maxCostFeeEther.toString(),
        totalAmountEther
      });
    }
    this.getNetworkFromSignedTransaction();
  }

  public async getNetworkFromSignedTransaction() {
    const decodedTranasction = utils.parseTransaction(this.props.stateValues.signedTransaction);
    const chainId = decodedTranasction.chainId.toString();
    const network = await getNetworkByChainId(chainId);

    if (network) {
      const networkName = network.name;
      this.setState({ networkFromSignedTransaction: networkName });
    }
  }

  public componentWillMount() {
    this.decodeTransaction();
  }

  public render() {
    const { stateValues: { transactionFields: { account: { label } } } } = this.props;
    const {
      showingDetails,
      toAddressFromSignedTransaction,
      senderAddressFromSignedTransaction,
      amountToSendFromSignedTransaction,
      gasLimitWeiFromSignedTransaction,
      gasPriceWeiFromSignedTransaction,
      nonceFromSignedTransaction,
      networkFromSignedTransaction,
      dataFromSignedTransaction,
      maxCostFeeEther,
      totalAmountEther
    } = this.state;

    return (
      <div className="ConfirmTransaction">
        <AddressBookContext.Consumer>
          {({ addressBook }) => {
            let recipientLabel: string = 'Unknown Account';
            let senderLabel: string | undefined = 'Unknown Account';
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
            <Amount
              assetValue={`${amountToSendFromSignedTransaction} ETH`}
              fiatValue="$12,000.00"
            />
          </div>
        </div>
        <div className="ConfirmTransaction-row">
          <div className="ConfirmTransaction-row-column">
            <img src={feeIcon} alt="Fee" /> Transaction Fee:
          </div>
          <div className="ConfirmTransaction-row-column">
            <Amount assetValue={`${maxCostFeeEther} ETH`} fiatValue="$0.21" />
          </div>
        </div>
        <div className="ConfirmTransaction-divider" />
        <div className="ConfirmTransaction-row">
          <div className="ConfirmTransaction-row-column">
            <img src={sendIcon} alt="Total" /> You'll Send:
          </div>
          <div className="ConfirmTransaction-row-column">
            <Amount assetValue={totalAmountEther} fiatValue="$12,000.21" />
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
                {`${utils.formatEther(gasLimitWeiFromSignedTransaction)} ETH`}
              </div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Gas Price:</div>
              <div className="ConfirmTransaction-details-row-column">
                {`${utils.formatEther(gasPriceWeiFromSignedTransaction)} ETH`}
              </div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Max TX Fee:</div>
              <div className="ConfirmTransaction-details-row-column">{maxCostFeeEther} ETH</div>
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
        <Button onClick={this.sendTransaction} className="ConfirmTransaction-button">
          Confirm and Send
        </Button>
      </div>
    );
  }

  private sendTransaction = async () => {
    const network: string = this.state.networkFromSignedTransaction;
    const signedTransaction: string = this.props.stateValues.signedTransaction;

    //@ts-ignore
    const transactionProvider: FallbackProvider = allProviders[network];
    const broadcastTransaction = await transactionProvider.sendTransaction(signedTransaction);

    console.log(broadcastTransaction);
  };

  private toggleShowingDetails = () =>
    this.setState((prevState: State) => ({
      showingDetails: !prevState.showingDetails
    }));
}
