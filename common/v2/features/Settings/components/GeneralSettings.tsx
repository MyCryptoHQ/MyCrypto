import React from 'react';
import { Button, Tooltip, Icon } from '@mycrypto/ui';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import translate from 'v2/translations';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { ISettings } from 'v2/types';
import { DashboardPanel } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';

const Divider = styled.div`
  height: 2px;
  margin-bottom: 15px;
  background: #e8eaed;
`;

const SettingsField = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px 29px 30px;

  @media (max-width: 700px) {
    display: block;
  }
`;

const SettingsLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const SettingsTooltipIcon = styled(Icon)`
  margin-left: 10px;
  height: 1em;
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
  globalSettings: ISettings;
  updateGlobalSettings(settings: ISettings): void;
}

const timerOptions = [
  { name: '1 Minutes', value: '60000' },
  { name: '3 Minutes', value: '180000' },
  { name: '5 Minutes', value: '300000' },
  { name: '10 Minutes', value: '600000' },
  { name: '15 Minutes', value: '900000' },
  { name: '30 Minutes', value: '1800000' },
  { name: '45 Minutes', value: '2700000' },
  { name: '1 Hours', value: '3600000' },
  { name: '3 Hours', value: '10800000' },
  { name: '6 Hours', value: '21600000' },
  { name: '12 Hours', value: '43200000' }
];

export default class GeneralSettings extends React.Component<SettingsProps> {
  public changeTimer = (event: React.FormEvent<HTMLSelectElement>) => {
    const target = event.target as HTMLSelectElement;
    const settings = this.props.globalSettings;
    settings.inactivityTimer = Number(target.value);
    this.props.updateGlobalSettings(settings);

    const selectedTimer = timerOptions.find(selection => selection.value === target.value);
    if (selectedTimer) {
      AnalyticsService.instance.track(
        ANALYTICS_CATEGORIES.SETTINGS,
        `User set inactivity timer to ${selectedTimer.name}`
      );
    }
  };

  public render() {
    const { globalSettings } = this.props;
    return (
      <DashboardPanel heading={translate('SETTINGS_GENERAL_LABEL')}>
        <Divider />
        <SettingsField>
          <SettingsLabel>
            {translate('SETTINGS_HANDLING_LABEL')}
            <Tooltip tooltip={<span>{translate('SETTINGS_TOOLTIP')}</span>}>
              <div>
                <SettingsTooltipIcon icon="shape" />
              </div>
            </Tooltip>
          </SettingsLabel>
          <SettingsControl>
            <Link to={ROUTE_PATHS.SETTINGS_IMPORT.path}>
              <SettingsButton secondary={true}>{translate('SETTINGS_IMPORT_LABEL')}</SettingsButton>
            </Link>
            <Link to={ROUTE_PATHS.SETTINGS_EXPORT.path}>
              <SettingsButton secondary={true}>{translate('SETTINGS_EXPORT_LABEL')}</SettingsButton>
            </Link>
          </SettingsControl>
        </SettingsField>
        <SettingsField>
          <SettingsLabel>{translate('SETTINGS_PAPER_LABEL')}</SettingsLabel>
          <SettingsControl>
            <SettingsButton secondary={true}>{translate('SETTINGS_DOWNLOAD_LABEL')}</SettingsButton>
            <SettingsButton secondary={true}>{translate('SETTINGS_PRINT_LABEL')}</SettingsButton>
          </SettingsControl>
        </SettingsField>
        <SettingsField>
          <SettingsLabel>{translate('SETTINGS_INACTIVITY_LABEL')}</SettingsLabel>
          <SettingsControl>
            <SelectContainer>
              <select onChange={this.changeTimer} value={String(globalSettings.inactivityTimer)}>
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
