import React from 'react';
import { Button, Switch } from '@mycrypto/ui';

import { DashboardPanel } from '../../components';
import './GeneralSettings.scss';

export default function GeneralSettings() {
  return (
    <DashboardPanel heading="General Settings" className="GeneralSettings">
      <div className="GeneralSettings-divider" />
      <div className="GeneralSettings-field">
        <div className="GeneralSettings-field-label">Moon Mode</div>
        <div className="GeneralSettings-field-control">
          <Switch labelLeft="Off" labelRight="on" checked={true} />
        </div>
      </div>
      <div className="GeneralSettings-field">
        <div className="GeneralSettings-field-label">Account Settings</div>
        <div className="GeneralSettings-field-control">
          <Button secondary={true}>Import</Button>
          <Button secondary={true}>Export</Button>
        </div>
      </div>
    </DashboardPanel>
  );
}
