import translate from 'translations';
import classnames from 'classnames';
import { DataFieldFactory } from 'components/DataFieldFactory';
import { GasFieldFactory } from 'components/GasFieldFactory';
import { SendButtonFactory } from 'components/SendButtonFactory';
import { NonceField } from 'components/NonceField';
import { OfflineAwareUnlockHeader } from 'components';
import { GenerateTransaction } from 'components/GenerateTransaction';
import React, { Component } from 'react';
import { setToField, TSetToField } from 'actions/transaction';
import { connect } from 'react-redux';

interface DispatchProps {
  setToField: TSetToField;
}
class DeployClass extends Component<DispatchProps> {
  public render() {
    return (
      <div className="Deploy">
        <section>
          <OfflineAwareUnlockHeader />

          <label className="Deploy-field form-group">
            <h4 className="Deploy-field-label">{translate('CONTRACT_ByteCode')}</h4>
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
          </label>

          <label className="Deploy-field form-group">
            <h4 className="Deploy-field-label">Gas Limit</h4>
            <GasFieldFactory
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
              <NonceField />
            </div>
          </div>
          <div className="row form-group">
            <div className="col-xs-12 clearfix">
              <GenerateTransaction />
            </div>
          </div>
          <SendButtonFactory
            withProps={({ onClick }) => (
              <button className="Deploy-submit btn btn-primary" onClick={onClick}>
                {translate('NAV_DeployContract')}
              </button>
            )}
          />
        </section>
      </div>
    );
  }
}

export const Deploy = connect(null, { setToField })(DeployClass);
