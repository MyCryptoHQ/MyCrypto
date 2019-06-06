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
  width: 205px;
  text-align: center;
  select {
    border: none;
    height: 2em;
    background: none;
  }
`;

const SettingsButton = styled(Button)`
  width: 105px;
  padding: 12px 12px;
`;

interface SettingsProps {
  globalSettings: GlobalSettings;
  updateGlobalSettings(settings: GlobalSettings): void;
}

const timerOptions = [
  { name: '1 Minutes', value: '60000' },
  { name: '3 Minutes', value: '180000' },
  { name: '5 Minutes', value: '300000' },
  { name: '10 Minutes', value: '600000' },
  { name: '15 Minutes', value: '900000' },
  { name: '30 Minutes', value: '1800000' },
  { name: '45 Minutes', value: '2700000' },
  { name: '1 Hour', value: '3600000' },
  { name: '3 Hour', value: '10800000' },
  { name: '6 Hour', value: '21600000' },
  { name: '12 Hour', value: '43200000' }
];

export default class GeneralSettings extends React.Component<SettingsProps> {
  public changeTimer = (event: React.FormEvent<HTMLSelectElement>) => {
    const target = event.target as HTMLSelectElement;
    const settings = this.props.globalSettings;
    settings.timer = Number(target.value);
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
              <SettingsButton secondary={true}>Import</SettingsButton>
            </Link>
            <Link to="/export">
              <SettingsButton secondary={true}>Export</SettingsButton>
            </Link>
          </SettingsControl>
        </SettingsField>
        <SettingsField>
          <SettingsLabel>Paper Wallet</SettingsLabel>
          <SettingsControl>
            <SettingsButton secondary={true}>Download</SettingsButton>
            <SettingsButton secondary={true}>Print</SettingsButton>
          </SettingsControl>
        </SettingsField>
        <SettingsField>
          <SettingsLabel>Inactivity Timer</SettingsLabel>
          <SettingsControl>
            <SelectContainer>
              <select onChange={this.changeTimer} value={String(globalSettings.timer)}>
                {timerOptions.map(option => (
                  <option value={option.value} key={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </SelectContainer>
          </SettingsControl>
        </SettingsField>
      </DashboardPanel>
    );
  }
}
