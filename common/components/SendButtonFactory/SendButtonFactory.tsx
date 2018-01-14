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

export interface CallbackProps {
  onClick(): void;
}

interface StateProps {
  walletType: IWalletType;
}
interface OwnProps {
  onlyTransactionParameters?: boolean;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const getStringifiedTx = (serializedTransaction: string) =>
  JSON.stringify(getTransactionFields(makeTransaction(serializedTransaction)), null, 2);

type Props = StateProps & OwnProps;
class SendButtonFactoryClass extends Component<Props> {
  public render() {
    const { onlyTransactionParameters } = this.props;
    const columnSize = onlyTransactionParameters ? 12 : 6;
    return (
      <SerializedTransaction
        withSerializedTransaction={serializedTransaction => (
          <React.Fragment>
            <div className={`col-sm-${columnSize}`}>
              <label>
                {this.props.walletType.isWeb3Wallet
                  ? 'Transaction Parameters'
                  : translate('SEND_raw')}
              </label>
              <textarea
                className="form-control"
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
                <textarea
                  className="form-control"
                  value={addHexPrefix(serializedTransaction)}
                  rows={4}
                  readOnly={true}
                />
              </div>
            )}
            <OfflineBroadcast />
            <OnlineSend withProps={this.props.withProps} />
          </React.Fragment>
        )}
      />
    );
  }
}

export const SendButtonFactory = connect((state: AppState) => ({
  walletType: getWalletType(state)
}))(SendButtonFactoryClass);
