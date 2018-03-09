import translate from 'translations';
import { getTransactionFields, makeTransaction } from 'libs/transaction';
import { OfflineBroadcast } from './OfflineBroadcast';
import { SerializedTransaction } from 'components/renderCbs';
import { OnlineSend } from './OnlineSend';
import { addHexPrefix } from 'ethereumjs-util';
import { getWalletType, IWalletType } from 'selectors/wallet';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { TextArea } from 'components/ui';
import { getSerializedTransaction } from 'selectors/transaction';

export interface CallbackProps {
  disabled: boolean;
  onClick(): void;
}

interface StateProps {
  walletType: IWalletType;
  stateTransaction: AppState['transaction']['sign']['local']['signedTransaction'];
}

interface OwnProps {
  onlyTransactionParameters?: boolean;
  toggleDisabled?: boolean;
  Modal: typeof ConfirmationModal;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const getStringifiedTx = (serializedTransaction: string) =>
  JSON.stringify(getTransactionFields(makeTransaction(serializedTransaction)), null, 2);

type Props = StateProps & OwnProps;
class SendButtonFactoryClass extends Component<Props> {
  public render() {
    const { onlyTransactionParameters, stateTransaction, toggleDisabled } = this.props;
    const columnSize = onlyTransactionParameters ? 12 : 6;
    return (
      <div>
        <SerializedTransaction
          withSerializedTransaction={serializedTransaction => (
            <React.Fragment>
              <div className={`col-sm-${columnSize}`}>
                <label>
                  {this.props.walletType.isWeb3Wallet
                    ? 'Transaction Parameters'
                    : translate('SEND_raw')}
                </label>
                <TextArea
                  value={getStringifiedTx(serializedTransaction)}
                  rows={4}
                  readOnly={true}
                />
              </div>
              {!onlyTransactionParameters && (
                <div className="col-sm-6">
                  <label>
                    {this.props.walletType.isWeb3Wallet
                      ? 'Serialized Transaction Parameters'
                      : translate('SEND_signed')}
                  </label>
                  <TextArea value={addHexPrefix(serializedTransaction)} rows={4} readOnly={true} />
                </div>
              )}
              <OfflineBroadcast />
              {!toggleDisabled ? (
                <OnlineSend
                  withOnClick={({ onClick }) =>
                    this.props.withProps({
                      disabled: toggleDisabled ? (stateTransaction !== null ? false : true) : false,
                      onClick: onClick
                    })
                  }
                  Modal={this.props.Modal}
                />
              ) : null}
            </React.Fragment>
          )}
        />
        {toggleDisabled ? (
          <OnlineSend
            withOnClick={({ onClick }) =>
              this.props.withProps({
                disabled: toggleDisabled ? (stateTransaction !== null ? false : true) : false,
                onClick: onClick
              })
            }
            Modal={this.props.Modal}
          />
        ) : null}
      </div>
    );
  }
}

export const SendButtonFactory = connect((state: AppState) => ({
  walletType: getWalletType(state),
  stateTransaction: getSerializedTransaction(state)
}))(SendButtonFactoryClass);
