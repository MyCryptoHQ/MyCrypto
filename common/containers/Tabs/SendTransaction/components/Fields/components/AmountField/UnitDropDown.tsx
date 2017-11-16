import React from 'react';
import { SetDecimalMetaField, SetUnitMetaField } from 'components/renderCbs';
import { ConditionalUnitDropdown } from './components';

export const UnitDropDown: React.SFC<{}> = () => (
  <SetDecimalMetaField
    withDecimalSetter={decimalSetter => (
      <SetUnitMetaField
        withUnitSetter={unitSetter => (
          <ConditionalUnitDropdown
            onDecimalChange={decimalSetter}
            onUnitChange={unitSetter}
          />
        )}
      />
    )}
  />
);
