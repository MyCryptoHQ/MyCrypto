import translate from 'translations';
import { getTransactionFields, makeTransaction } from 'libs/transaction';
import { OfflineBroadcast } from './OfflineBroadcast';
import { OnlineSend } from './OnlineSend';
import { addHexPrefix } from 'ethereumjs-util';
import { getWalletType, IWalletType } from 'selectors/wallet';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { getSerializedTransaction } from 'selectors/transaction';
import Code from 'components/ui/Code';

export interface CallbackProps {
  disabled: boolean;
  onClick(): void;
}

interface StateProps {
  walletType: IWalletType;
  serializedTransaction: AppState['transaction']['sign']['local']['signedTransaction'];
}

interface OwnProps {
  onlyTransactionParameters?: boolean;
  toggleDisabled?: boolean;
  Modal: typeof ConfirmationModal;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const getStringifiedTx = (serializedTransaction: Buffer) =>
  JSON.stringify(getTransactionFields(makeTransaction(serializedTransaction)), null, 2);

type Props = StateProps & OwnProps;

class SendButtonFactoryClass extends Component<Props> {
  public render() {
    const {
      onlyTransactionParameters,
      serializedTransaction,
      toggleDisabled,
      walletType
    } = this.props;

    /* Left and right transaction comparision boxes, only displayed when a serialized transaction
    exists in state */

    // shows the json representation of the transaction
    const leftTxCompare = serializedTransaction && (
      <div className="col-xs-12">
        <label>{walletType.isWeb3Wallet ? 'Transaction Parameters' : translate('SEND_raw')}</label>
        <Code>{getStringifiedTx(serializedTransaction)}</Code>
      </div>
    );

    // shows the serialized representation of the transaction
    // "onlyTransactionParameters" used in broadcast tx so the same serialized tx isnt redundantly
    // displayed
    const rightTxCompare = serializedTransaction &&
      !onlyTransactionParameters && (
        <div className="col-xs-12">
          <label>
            {walletType.isWeb3Wallet
              ? 'Serialized Transaction Parameters'
              : translate('SEND_signed')}
          </label>
          <Code>{addHexPrefix(serializedTransaction.toString('hex'))}</Code>
        </div>
      );

    const shouldDisplayOnlineSend = toggleDisabled || serializedTransaction;

    return (
      <>
        {leftTxCompare}
        {rightTxCompare}
        <OfflineBroadcast />
        {shouldDisplayOnlineSend && (
          <OnlineSend
            withOnClick={({ onClick }) =>
              this.props.withProps({
                disabled: !!(toggleDisabled && !serializedTransaction),
                onClick
              })
            }
            Modal={this.props.Modal}
          />
        )}
      </>
    );
  }
}

export const SendButtonFactory = connect((state: AppState) => ({
  walletType: getWalletType(state),
  serializedTransaction: getSerializedTransaction(state)
}))(SendButtonFactoryClass);
