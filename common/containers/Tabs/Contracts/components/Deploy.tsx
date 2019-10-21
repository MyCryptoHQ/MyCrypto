import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { transactionFieldsActions } from 'features/transaction';
import { walletActions } from 'features/wallet';
import { NonceField, TXMetaDataPanel, SigningStatus } from 'components';
import { FullWalletOnly } from 'components/renderCbs';
import { TextArea } from 'components/ui';
import { DataFieldFactory } from 'components/DataFieldFactory';
import { SendButtonFactory } from 'components/SendButtonFactory';
import WalletDecrypt, { DISABLE_WALLETS } from 'components/WalletDecrypt';
import { ConfirmationModal } from 'components/ConfirmationModal';
import './Deploy.scss';

interface DispatchProps {
  resetWallet: walletActions.TResetWallet;
  resetTransactionRequested: transactionFieldsActions.TResetTransactionRequested;
}

class DeployClass extends Component<DispatchProps> {
  public componentDidMount() {
    this.props.resetTransactionRequested();
  }

  public render() {
    const makeContent = () => (
      <main className="Deploy Tab-content-pane" role="main">
        <button className="Deploy-field-reset btn btn-default btn-sm" onClick={this.changeWallet}>
          <i className="fa fa-refresh" />
          {translate('CHANGE_WALLET')}
        </button>

        <div className="input-group-wrapper Deploy-field">
          <label className="input-group">
            <div className="input-group-header">{translate('CONTRACT_BYTECODE')}</div>
            <DataFieldFactory
              withProps={({ data: { raw }, onChange, readOnly, validData }) => (
                <TextArea
                  isValid={validData && !!raw}
                  name="byteCode"
                  placeholder="0x8f87a973e..."
                  rows={6}
                  onChange={onChange}
                  disabled={readOnly}
                  className="Deploy-field-input"
                  value={raw}
                />
              )}
            />
          </label>
        </div>

        <div className="row form-group">
          <div className="col-xs-12 clearfix">
            <NonceField alwaysDisplay={false} />
          </div>
        </div>

        <div className="row form-group">
          <div className="col-xs-12 clearfix">
            <TXMetaDataPanel
              initialState="advanced"
              disableToggle={true}
              advancedGasOptions={{ dataField: false }}
            />
          </div>
        </div>

        <SendButtonFactory
          signing={true}
          Modal={ConfirmationModal}
          withProps={({ disabled, signTx, openModal }) => (
            <button
              disabled={disabled}
              className="Deploy-submit btn btn-primary btn-block"
              onClick={() => {
                signTx();
                openModal();
              }}
            >
              {translate('NAV_DEPLOYCONTRACT')}
            </button>
          )}
        />
        <SigningStatus />
      </main>
    );

    const makeDecrypt = () => <WalletDecrypt disabledWallets={DISABLE_WALLETS.READ_ONLY} />;

    return <FullWalletOnly withFullWallet={makeContent} withoutFullWallet={makeDecrypt} />;
  }

  private changeWallet = () => {
    this.props.resetWallet();
  };
}

export const Deploy = connect(
  null,
  {
    resetWallet: walletActions.resetWallet,
    resetTransactionRequested: transactionFieldsActions.resetTransactionRequested
  }
)(DeployClass);
