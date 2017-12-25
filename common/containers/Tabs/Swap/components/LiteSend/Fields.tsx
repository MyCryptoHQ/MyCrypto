import React, { Component } from 'react';
import { AmountFieldFactory } from 'components/AmountFieldFactory';
import { GasFieldFactory } from 'components/GasFieldFactory';
import { AddressFieldFactory } from 'components/AddressFieldFactory';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

import { Aux } from 'components/ui';
import { GenerateTransaction, SendButton, SigningStatus } from 'components';
import translate from 'translations';
import { getUnit } from 'selectors/transaction';

interface StateProps {
  unit: string;
}

type Props = StateProps;
class FieldsClass extends Component<Props> {
  public render() {
    return (
      <div className="Tab-content-pane">
        <div className="row form-group">
          <div className="col-xs-11">
            <AddressFieldFactory
              withProps={({ currentTo }) => (
                <input className="form-control" type="text" value={currentTo.raw} readOnly={true} />
              )}
            />
          </div>
          <div className="col-xs-1" />
        </div>

        <div className="row form-group">
          <div className="col-xs-11">
            <label>{translate('SEND_amount')}</label>

            <AmountFieldFactory
              withProps={({ currentValue, isValid }) => (
                <Aux>
                  {!isValid && (
                    <h5 style={{ color: 'red' }}>
                      WARNING: Your balance is not high enough to complete this transaction! Please
                      send more funds or switch to a different wallet
                    </h5>
                  )}
                  <input
                    className="form-control"
                    type="text"
                    value={`${currentValue.raw} ${this.props.unit}`}
                    readOnly={true}
                  />
                </Aux>
              )}
            />
          </div>
        </div>
        <div className="row form-group">
          <div className="col-xs-11">
            <label>{translate('TRANS_gas')} </label>

            <GasFieldFactory
              withProps={({ gasLimit }) => (
                <input className="form-control" type="text" value={gasLimit.raw} readOnly={true} />
              )}
            />
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
}

export const Fields = connect((state: AppState) => ({ unit: getUnit(state) }))(FieldsClass);
