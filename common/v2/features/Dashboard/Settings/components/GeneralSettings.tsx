import React from 'react';
import { Button } from '@mycrypto/ui';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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
export default function GeneralSettings(props) {
  const { updateGlobalSettings } = props;
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
            <select>
              <option value="1 Minutes">1 Minutes</option>
              <option value="2 Minutes">2 Minutes</option>
              <option value="3 Minutes">3 Minutes</option>
              <option value="4 Minutes">4 Minutes</option>
              <option value="5 Minutes">5 Minutes</option>
            </select>
          </SelectContainer>
        </SettingsControl>
      </SettingsField>
    </DashboardPanel>
  );
}
