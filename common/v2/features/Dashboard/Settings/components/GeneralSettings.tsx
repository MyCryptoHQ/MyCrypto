import React from 'react';
import { Button } from '@mycrypto/ui';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalSettings } from './types';

import { DashboardPanel } from '../../components';
import { GlobalSettings } from 'v2/services';

const Divider = styled.div`
  height: 2px;
  margin-bottom: 15px;
  background: #e8eaed;
`;

const SettingsField = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 29px;
  padding: 0 30px;
`;

const SettingsLabel = styled.div`
  font-size: 20px;
`;

const SettingsControl = styled.div`
  button {
    margin-left: 15px;
  }
`;

const SelectContainer = styled.div`
  border: 0.125em solid #007896;
  padding: 0.6rem;

  select {
    border: none;
    height: 2em;
    background: none;
  }
`;

interface SettingsProps {
  globalSettings: GlobalSettings;
  updateGlobalSettings(settings: GlobalSettings): void;
}
export default class GeneralSettings extends React.Component<SettingsProps> {
  public changeTimer = event => {
    let settings = this.props.globalSettings;
    settings.timer = Number(event.target.value);
    this.props.updateGlobalSettings(settings);
  };

  public render() {
    const { updateGlobalSettings, globalSettings } = this.props;
    return (
      <DashboardPanel heading="General Settings">
        <Divider />
        <SettingsField>
          <SettingsLabel>Account Settings</SettingsLabel>
          <SettingsControl>
            <Link to="/dashboard/settings/import">
              <Button secondary={true}>Import</Button>
            </Link>
            <Link to="/dashboard/settings/export">
              <Button secondary={true}>Export</Button>
            </Link>
          </SettingsControl>
        </SettingsField>
        <SettingsField>
          <SettingsLabel>Paper Wallet</SettingsLabel>
          <SettingsControl>
            <Button secondary={true}>Download</Button>
            <Button secondary={true}>Print</Button>
          </SettingsControl>
        </SettingsField>
        <SettingsField>
          <SettingsLabel>Inactivity Timer</SettingsLabel>
          <SettingsControl>
            <SelectContainer>
              <select onChange={this.changeTimer} value={String(globalSettings.timer)}>
                <option value="1">1 Minutes</option>
                <option value="2">2 Minutes</option>
                <option value="3">3 Minutes</option>
                <option value="4">4 Minutes</option>
                <option value="5">5 Minutes</option>
              </select>
            </SelectContainer>
          </SettingsControl>
        </SettingsField>
      </DashboardPanel>
    );
  }
}
