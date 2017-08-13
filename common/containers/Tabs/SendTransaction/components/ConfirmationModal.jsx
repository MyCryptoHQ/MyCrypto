// @flow
import './ConfirmationModal.scss';
import React from 'react';
import translate from 'translations';
import Big from 'bignumber.js';
import BaseWallet from 'libs/wallet/base';
import { toUnit } from 'libs/units';
import type { NodeConfig } from 'config/data';
import type { RawTransaction } from 'libs/transaction';

import Modal from 'components/ui/Modal';
import Identicon from 'components/ui/Identicon';

// TODO: Handle other token types?
type Props = {
  rawTransaction: RawTransaction,
  wallet: BaseWallet,
  node: NodeConfig,
  onConfirm: RawTransaction => void,
  onCancel: () => void
};

type State = {
  address: string,
  value: string,
  gasPrice: string,
  nonce: string,
  timeToRead: number
};

export default class ConfirmationModal extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    const { value, gasPrice, nonce } = props.rawTransaction;

    this.state = {
      address: '',
      value: toUnit(new Big(value, 16), 'wei', 'ether').toString(),
      gasPrice: toUnit(new Big(gasPrice, 16), 'wei', 'gwei').toString(),
      nonce: new Big(nonce, 16).toString(),
      timeToRead: 5
    };
  }

  // Count down 5 seconds before allowing them to confirm
  readTimer = null;
  componentDidMount() {
    this.readTimer = setInterval(() => {
      if (this.state.timeToRead > 0) {
        this.setState({ timeToRead: this.state.timeToRead - 1 });
      } else {
        clearTimeout(this.readTimer);
      }
    }, 1000);

    this.props.wallet.getAddress().then(address => {
      this.setState({ address });
    });
  }

  componentWillUnmount() {
    clearTimeout(this.readTimer);
  }

  _confirm() {
    if (this.state.timeToRead < 1) {
      this.props.onConfirm(this.props.rawTransaction);
    }
  }

  render() {
    const { node, rawTransaction, onCancel } = this.props;
    const { address, value, gasPrice, timeToRead } = this.state;

    const buttonPrefix = timeToRead > 0 ? `(${timeToRead}) ` : '';
    const buttons = [
      {
        text: buttonPrefix + translate('SENDModal_Yes'),
        type: 'primary',
        disabled: timeToRead > 0,
        onClick: this._confirm()
      },
      {
        text: translate('SENDModal_No'),
        type: 'default',
        onClick: onCancel
      }
    ];

    return (
      <Modal
        title="Confirm Your Transaction"
        buttons={buttons}
        handleClose={onCancel}
        isOpen={true}
      >
        <div className="ConfModal">
          <div className="ConfModal-summary">
            <div className="ConfModal-summary-icon ConfModal-summary-icon--from">
              <Identicon size="100%" address={address} />
            </div>
            <div className="ConfModal-summary-amount">
              <div className="ConfModal-summary-amount-arrow" />
              <div className="ConfModal-summary-amount-currency">
                {value} ETH
              </div>
            </div>
            <div className="ConfModal-summary-icon ConfModal-summary-icon--to">
              <Identicon size="100%" address={rawTransaction.to} />
            </div>
          </div>

          <ul className="ConfModal-details">
            <li className="ConfModal-details-detail">
              You are sending from <code>{address}</code>
            </li>
            <li className="ConfModal-details-detail">
              You are sending to <code>{rawTransaction.to}</code>
            </li>
            <li className="ConfModal-details-detail">
              You are sending <strong>{value} ETH</strong> with a gas price of{' '}
              <strong>{gasPrice} gwei</strong>
            </li>
            <li className="ConfModal-details-detail">
              You are interacting with the <strong>{node.network}</strong>{' '}
              network provided by <strong>{node.service}</strong>
            </li>
            <li className="ConfModal-details-detail">
              {rawTransaction.data
                ? <span>
                    You are sending the following data:{' '}
                    <code>{rawTransaction.data}</code>
                  </span>
                : 'There is no data attached to this transaction'}
            </li>
          </ul>

          <div className="ConfModal-confirm">
            {translate('SENDModal_Content_3')}
          </div>
        </div>
      </Modal>
    );
  }
}
