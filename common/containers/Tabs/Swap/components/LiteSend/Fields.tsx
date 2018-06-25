import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { Wei, TokenValue } from 'libs/units';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { walletActions } from 'features/wallet';
import { SendButton, TXMetaDataPanel } from 'components';
import { AmountFieldFactory } from 'components/AmountFieldFactory';
import { AddressFieldFactory } from 'components/AddressFieldFactory';
import Spinner from 'components/ui/Spinner';
import { Input } from 'components/ui';

interface StateProps {
  unit: string;
  resetWallet: walletActions.TResetWallet;
  currentBalance: Wei | TokenValue | null;
}

type Props = StateProps;
class FieldsClass extends Component<Props> {
  public render() {
    const { currentBalance } = this.props;
    return (
      <div className="Tab-content-pane">
        <div className="row form-group">
          <div className="col-xs-12">
            <button
              className="Deploy-field-reset btn btn-default btn-sm"
              onClick={this.changeWallet}
            >
              <i className="fa fa-refresh" />
              {translate('CHANGE_WALLET')}
            </button>
          </div>
          <div className="col-xs-12">
            <AddressFieldFactory
              withProps={({ currentTo }) => (
                <Input
                  type="text"
                  value={currentTo.raw}
                  readOnly={true}
                  isValid={!!currentTo.raw}
                />
              )}
            />
          </div>
          <div className="col-xs-1" />
        </div>

        <div className="row form-group">
          <div className="col-xs-12">
            <label>{translate('SEND_AMOUNT')}</label>
            {currentBalance === null ? (
              <div className="row text-center">
                <Spinner />
              </div>
            ) : (
              <AmountFieldFactory
                withProps={({ currentValue, isValid }) => (
                  <React.Fragment>
                    {!isValid && (
                      <h5 style={{ color: 'red' }}>{translate('INSUFFICIENT_FUNDS')}</h5>
                    )}
                    {isValid && (
                      <Input
                        isValid={true}
                        showValidAsPlain={true}
                        type="text"
                        value={`${currentValue.raw} ${this.props.unit}`}
                        readOnly={true}
                      />
                    )}
                  </React.Fragment>
                )}
              />
            )}
          </div>
        </div>
        <div className="row form-group">
          <div className="col-xs-12">
            <TXMetaDataPanel initialState={'simple'} disableToggle={true} />
          </div>
        </div>
        <div className="row form-group">
          <div className="col-xs-12 clearfix">
            {currentBalance === null ? (
              <div className="row text-center">
                <Spinner />
              </div>
            ) : (
              <SendButton signing={true} />
            )}
          </div>
        </div>
      </div>
    );
  }
  private changeWallet = () => {
    this.props.resetWallet();
  };
}

export const Fields = connect(
  (state: AppState) => ({
    unit: selectors.getUnit(state),
    currentBalance: selectors.getCurrentBalance(state)
  }),
  { resetWallet: walletActions.resetWallet }
)(FieldsClass);
