import translate from 'translations';
import classnames from 'classnames';
import { DataFieldFactory } from 'components/DataFieldFactory';
import { SendButtonFactory } from 'components/SendButtonFactory';
import { SigningStatus } from 'components/SigningStatus';
import WalletDecrypt, { DISABLE_WALLETS } from 'components/WalletDecrypt';
import { GenerateTransaction } from 'components/GenerateTransaction';
import React, { Component } from 'react';
import { setToField, TSetToField } from 'actions/transaction';
import { resetWallet, TResetWallet } from 'actions/wallet';
import { connect } from 'react-redux';
import { FullWalletOnly } from 'components/renderCbs';
import { NonceField, TXMetaDataPanel } from 'components';
import './Deploy.scss';
import { ConfirmationModal } from 'components/ConfirmationModal';
import { TextArea } from 'components/ui';

interface DispatchProps {
  setToField: TSetToField;
  resetWallet: TResetWallet;
}

class DeployClass extends Component<DispatchProps> {
  public render() {
    const makeContent = () => (
      <main className="Deploy Tab-content-pane" role="main">
        <button className="Deploy-field-reset btn btn-default btn-sm" onClick={this.changeWallet}>
          <i className="fa fa-refresh" />
          {translate('Change Wallet')}
        </button>

        <div className="input-group-wrapper Deploy-field">
          <label className="input-group">
            <div className="input-group-header">{translate('CONTRACT_ByteCode')}</div>
            <DataFieldFactory
              withProps={({ data: { raw, value }, onChange, readOnly }) => (
                <TextArea
                  name="byteCode"
                  placeholder="0x8f87a973e..."
                  rows={6}
                  onChange={onChange}
                  disabled={readOnly}
                  className={classnames('Deploy-field-input', 'form-control', {
                    'is-valid': value && value.length > 0
                  })}
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

        <div className="row form-group">
          <div className="col-xs-12 clearfix">
            <GenerateTransaction />
          </div>
        </div>
        <SigningStatus />
        <SendButtonFactory
          Modal={ConfirmationModal}
          withProps={({ onClick }) => (
            <button className="Deploy-submit btn btn-primary" onClick={onClick}>
              {translate('NAV_DeployContract')}
            </button>
          )}
        />
      </main>
    );

    const makeDecrypt = () => <WalletDecrypt disabledWallets={DISABLE_WALLETS.READ_ONLY} />;

    return <FullWalletOnly withFullWallet={makeContent} withoutFullWallet={makeDecrypt} />;
  }

  private changeWallet = () => {
    this.props.resetWallet();
  };
}

export const Deploy = connect(null, {
  setToField,
  resetWallet
})(DeployClass);
