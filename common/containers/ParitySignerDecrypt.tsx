import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import QrSigner from '@parity/qr-signer';
import { isValidETHAddress } from 'libs/validators';
import { ParitySignerWallet } from 'libs/wallet';
import {
  setWalletQrTransaction,
  TSetWalletQrTransaction,
  finalizeQrTransaction,
  TFinalizeQrTransaction
} from 'actions/wallet';

interface Props {
  setWalletQrTransaction: TSetWalletQrTransaction;
  finalizeQrTransaction: TFinalizeQrTransaction;
  onUnlock(param: any): void;
}

class ParitySignerDecrypt extends PureComponent<Props> {
  public render() {
    return (
      <div className="ParitySignerUnlock">
        <QrSigner size={300} scan={true} onScan={this.unlockAddress} />
      </div>
    );
  }

  private unlockAddress = (address: string) => {
    if (!isValidETHAddress(address)) {
      console.error('Invalid address!');
      return;
    }

    this.props.onUnlock(
      new ParitySignerWallet(
        address,
        this.props.setWalletQrTransaction,
        this.props.finalizeQrTransaction
      )
    );
  };
}

export default connect(() => ({}), {
  setWalletQrTransaction,
  finalizeQrTransaction
})(ParitySignerDecrypt);
