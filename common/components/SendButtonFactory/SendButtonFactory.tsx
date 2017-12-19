import translate from 'translations';
import { Aux } from 'components/ui';
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
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const getStringifiedTx = (serializedTransaction: string) =>
  JSON.stringify(getTransactionFields(makeTransaction(serializedTransaction)), null, 2);

type Props = StateProps & OwnProps;
class SendButtonFactoryClass extends Component<Props> {
  public render() {
    return (
      <SerializedTransaction
        withSerializedTransaction={serializedTransaction => (
          <Aux>
            <div className="col-sm-6">
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
            <OfflineBroadcast />
            <OnlineSend withProps={this.props.withProps} />
          </Aux>
        )}
      />
    );
  }
}

export const SendButtonFactory = connect((state: AppState) => ({
  walletType: getWalletType(state)
}))(SendButtonFactoryClass);
