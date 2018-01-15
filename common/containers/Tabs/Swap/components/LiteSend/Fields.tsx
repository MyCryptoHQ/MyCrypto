import React, { Component } from 'react';
import { AmountFieldFactory } from 'components/AmountFieldFactory';
import { AddressFieldFactory } from 'components/AddressFieldFactory';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { GenerateTransaction, SendButton, SigningStatus, GasSlider } from 'components';
import { resetWallet, TResetWallet } from 'actions/wallet';
import translate from 'translations';
import { getUnit } from 'selectors/transaction';

interface StateProps {
  unit: string;
  resetWallet: TResetWallet;
}

type Props = StateProps;
class FieldsClass extends Component<Props> {
  public render() {
    return (
      <div className="Tab-content-pane">
        <div className="row form-group">
          <div className="col-xs-12">
            <button
              className="Deploy-field-reset btn btn-default btn-sm"
              onClick={this.changeWallet}
            >
              <i className="fa fa-refresh" />
              {translate('Change Wallet')}
            </button>
          </div>
          <div className="col-xs-12">
            <AddressFieldFactory
              withProps={({ currentTo }) => (
                <input className="form-control" type="text" value={currentTo.raw} readOnly={true} />
              )}
            />
          </div>
          <div className="col-xs-1" />
        </div>

        <div className="row form-group">
          <div className="col-xs-12">
            <label>{translate('SEND_amount')}</label>

            <AmountFieldFactory
              withProps={({ currentValue, isValid }) => (
                <React.Fragment>
                  {!isValid && (
                    <h5 style={{ color: 'red' }}>
                      WARNING: Your ether or token balance is not high enough to complete this
                      transaction! Please send more funds or switch to a different wallet
                    </h5>
                  )}
                  {isValid && (
                    <input
                      className="form-control"
                      type="text"
                      value={`${currentValue.raw} ${this.props.unit}`}
                      readOnly={true}
                    />
                  )}
                </React.Fragment>
              )}
            />
          </div>
        </div>
        <div className="row form-group">
          <div className="col-xs-12">
            <GasSlider disableAdvanced={true} />
          </div>
        </div>
        <SigningStatus />
        <div className="row form-group">
          <div className="col-xs-12 clearfix">
            <GenerateTransaction />
          </div>
        </div>
        <div className="row form-group">
          <SendButton />
        </div>
      </div>
    );
  }
  private changeWallet = () => {
    this.props.resetWallet();
  };
}

export const Fields = connect((state: AppState) => ({ unit: getUnit(state) }), { resetWallet })(
  FieldsClass
);
