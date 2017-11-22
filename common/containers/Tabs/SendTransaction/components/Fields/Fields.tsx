import React from 'react';
import {
  NonceField,
  AddressField,
  AmountField,
  DataField,
  GasField,
  SendEverything,
  UnitDropDown
} from './components';

export const Fields: React.SFC<any> = () => (
  <div>
    <AddressField />

    <div className="row form-group">
      <div className="col-xs-11">
        <div className="input-group">
          <AmountField />
          <UnitDropDown />
        </div>
        <SendEverything />
      </div>
      <div className="col-xs-1" />
    </div>

    <div className="row form-group">
      <div className="col-xs-11">
        <GasField />
      </div>
    </div>
    <div className="row form-group">
      <div className="col-xs-11">
        <NonceField />
      </div>
    </div>
    <div className="row form-group">
      <div className="col-xs-11">
        <DataField />
      </div>
    </div>
  </div>
);
