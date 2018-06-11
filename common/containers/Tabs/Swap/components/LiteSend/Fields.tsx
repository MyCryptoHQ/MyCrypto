import React, { Component } from 'react';
import { AmountFieldFactory } from 'components/AmountFieldFactory';
import { AddressFieldFactory } from 'components/AddressFieldFactory';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { SendButton, TXMetaDataPanel } from 'components';
import { resetWallet, TResetWallet } from 'actions/wallet';
import translate from 'translations';
import { getUnit } from 'selectors/transaction';
import { getCurrentBalance } from 'selectors/wallet';
import Spinner from 'components/ui/Spinner';
import { Wei, TokenValue } from 'libs/units';
import { Input } from 'components/ui';
import { getNetworkConfig } from 'selectors/config';
import { NetworkConfig } from 'types/network';

interface StateProps {
  unit: string;
  resetWallet: TResetWallet;
  currentBalance: Wei | TokenValue | null;
  network: NetworkConfig;
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
    unit: getUnit(state),
    currentBalance: getCurrentBalance(state),
    network: getNetworkConfig(state)
  }),
  { resetWallet }
)(FieldsClass);
