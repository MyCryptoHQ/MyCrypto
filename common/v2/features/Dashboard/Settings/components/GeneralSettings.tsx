import React from 'react';
import { Button } from '@mycrypto/ui';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalSettings } from 'v2/services/GlobalSettings';

import { DashboardPanel } from '../../components';

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

  @media (max-width: 700px) {
    display: block;
  }
`;

const SettingsLabel = styled.div`
  font-size: 20px;
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const SettingsControl = styled.div`
  button {
    margin-left: 15px;
  }
  @media (max-width: 700px) {
    margin-top: 15px;
    width: 100%;
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
  public changeTimer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const settings = this.props.globalSettings;
    settings.timer = Number(event.target.value);
    this.props.updateGlobalSettings(settings);
  };

  public render() {
    const { globalSettings } = this.props;
    return (
      <DashboardPanel heading="General Settings">
        <Divider />
        <SettingsField>
          <SettingsLabel>Account Settings</SettingsLabel>
          <SettingsControl>
            <Link to="/import">
              <Button secondary={true}>Import</Button>
            </Link>
            <Link to="/export">
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
              <select onChange={() => this.changeTimer} value={String(globalSettings.timer)}>
                <option value="0">1 Minutes</option>
                <option value="1">3 Minutes</option>
                <option value="2">5 Minutes</option>
                <option value="3">10 Minutes</option>
                <option value="4">15 Minutes</option>
                <option value="5">30 Minutes</option>
                <option value="6">45 Minutes</option>
                <option value="7">1 Hour</option>
                <option value="8">3 Hour</option>
                <option value="9">6 Hour</option>
                <option value="10">12 Hour</option>
              </select>
            </SelectContainer>
          </SettingsControl>
        </SettingsField>
      </DashboardPanel>
    );
  }
}
