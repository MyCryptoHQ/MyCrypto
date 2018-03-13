import React from 'react';
import { SchedulingFields, UnavailableWallets } from 'containers/Tabs/SendTransaction/components';

export default function() {
  return (
    <React.Fragment>
      <SchedulingFields />
      <UnavailableWallets />
    </React.Fragment>
  );
}
