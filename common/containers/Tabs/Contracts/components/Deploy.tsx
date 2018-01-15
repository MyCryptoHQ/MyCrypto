import translate from 'translations';
import classnames from 'classnames';
import { DataFieldFactory } from 'components/DataFieldFactory';
import { GasLimitFieldFactory } from 'components/GasLimitFieldFactory';
import { SendButtonFactory } from 'components/SendButtonFactory';
import { SigningStatus } from 'components/SigningStatus';
import { NonceField } from 'components/NonceField';
import WalletDecrypt, { DISABLE_WALLETS } from 'components/WalletDecrypt';
import { GenerateTransaction } from 'components/GenerateTransaction';
import React, { Component } from 'react';
import { setToField, TSetToField } from 'actions/transaction';
import { resetWallet, TResetWallet } from 'actions/wallet';
import { connect } from 'react-redux';
import { FullWalletOnly } from 'components/renderCbs';
import './Deploy.scss';

interface DispatchProps {
  setToField: TSetToField;
  resetWallet: TResetWallet;
}

class DeployClass extends Component<DispatchProps> {
  public render() {
    const makeContent = () => (
      <main className="Deploy Tab-content-pane" role="main">
        <div className="Deploy-field form-group">
          <h3 className="Deploy-field-label">{translate('CONTRACT_ByteCode')}</h3>
          <button className="Deploy-field-reset btn btn-default btn-sm" onClick={this.changeWallet}>
            <i className="fa fa-refresh" />
            {translate('Change Wallet')}
          </button>
          <DataFieldFactory
            withProps={({ data: { raw, value }, onChange, readOnly }) => (
              <textarea
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
        </div>

        <label className="Deploy-field form-group">
          <h4 className="Deploy-field-label">Gas Limit</h4>
          <GasLimitFieldFactory
            withProps={({ gasLimit: { raw, value }, onChange, readOnly }) => (
              <input
                name="gasLimit"
                value={raw}
                disabled={readOnly}
                onChange={onChange}
                className={classnames('Deploy-field-input', 'form-control', {
                  'is-invalid': !value
                })}
              />
            )}
          />
        </label>
        <div className="row form-group">
          <div className="col-xs-11">
            <NonceField alwaysDisplay={false} />
          </div>
        </div>
        <div className="row form-group">
          <div className="col-xs-12 clearfix">
            <GenerateTransaction />
          </div>
        </div>
        <SigningStatus />
        <SendButtonFactory
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
