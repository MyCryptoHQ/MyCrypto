import React from 'react';

import { Button } from '@mycrypto/ui';
import { AnyAction, bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { DashboardPanel, SubHeading, Tooltip } from '@components';
import { Fiats, ROUTE_PATHS } from '@config';
import { AppState, getFiat, getInactivityTimer, setFiat, setInactivityTimer } from '@store';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { TFiatTicker } from '@types';

const Divider = styled.div`
  height: 2px;
  margin-bottom: ${SPACING.BASE};
  background: ${COLORS.GREY_ATHENS};
`;

const SettingsField = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${SPACING.BASE};
  padding-top: 0;
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    display: block;
  }
`;

const SettingsControl = styled.div`
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-top: ${SPACING.SM};
    width: 100%;
  }
`;

const SettingsButton = styled(Button)`
  width: 125px;
  padding: ${SPACING.SM};
`;

const SelectContainer = styled.div`
  border: 0.125em solid ${COLORS.BLUE_LIGHT};
  border-radius: 0.125em;
  padding: 0.6rem;
  width: 125px;
  select {
    width: 100%;
    border: none;
    height: 2em;
    background: none;
  }
`;

const timerOptions = [
  { name: translateRaw('ELAPSED_TIME_MINUTE', { $value: '1' }), value: '60000' },
  { name: translateRaw('ELAPSED_TIME_MINUTES', { $value: '3' }), value: '180000' },
  { name: translateRaw('ELAPSED_TIME_MINUTES', { $value: '5' }), value: '300000' },
  { name: translateRaw('ELAPSED_TIME_MINUTES', { $value: '10' }), value: '600000' },
  { name: translateRaw('ELAPSED_TIME_MINUTES', { $value: '15' }), value: '900000' },
  { name: translateRaw('ELAPSED_TIME_MINUTES', { $value: '30' }), value: '1800000' },
  { name: translateRaw('ELAPSED_TIME_MINUTES', { $value: '45' }), value: '2700000' },
  { name: translateRaw('ELAPSED_TIME_HOUR', { $value: '1' }), value: '3600000' },
  { name: translateRaw('ELAPSED_TIME_HOURS', { $value: '3' }), value: '10800000' },
  { name: translateRaw('ELAPSED_TIME_HOURS', { $value: '6' }), value: '21600000' },
  { name: translateRaw('ELAPSED_TIME_HOURS', { $value: '12' }), value: '43200000' }
];

const GeneralSettings = ({ inactivityTimer, fiatCurrency, setInactivityTimer, setFiat }: Props) => {
  const changeTimer = (event: React.FormEvent<HTMLSelectElement>) => {
    const target = event.target as HTMLSelectElement;
    setInactivityTimer(Number(target.value));
  };

  const changeCurrencySelection = (event: React.FormEvent<HTMLSelectElement>) => {
    const target = event.target as HTMLSelectElement;
    setFiat(target.value as TFiatTicker);
  };

  return (
    <DashboardPanel heading={translate('SETTINGS_GENERAL_LABEL')}>
      <Divider />
      <SettingsField>
        <SubHeading fontWeight="initial">
          {translate('SETTINGS_HANDLING_LABEL')}{' '}
          <Tooltip tooltip={<span>{translate('SETTINGS_TOOLTIP')}</span>} />
        </SubHeading>
        <SettingsControl>
          <Link to={ROUTE_PATHS.SETTINGS_IMPORT.path}>
            <SettingsButton secondary={true}>{translate('SETTINGS_IMPORT_LABEL')}</SettingsButton>
          </Link>
          <Link to={ROUTE_PATHS.SETTINGS_EXPORT.path} style={{ marginLeft: SPACING.SM }}>
            <SettingsButton secondary={true}>{translate('SETTINGS_EXPORT_LABEL')}</SettingsButton>
          </Link>
        </SettingsControl>
      </SettingsField>
      <SettingsField>
        <SubHeading fontWeight="initial">
          {translate('SETTINGS_INACTIVITY_LABEL')}{' '}
          <Tooltip tooltip={<span>{translate('SETTINGS_INACTIVITY_TOOLTIP')}</span>} />
        </SubHeading>
        <SettingsControl>
          <SelectContainer>
            <select onChange={changeTimer} value={String(inactivityTimer)}>
              {timerOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </SelectContainer>
        </SettingsControl>
      </SettingsField>
      <SettingsField>
        <SubHeading fontWeight="initial">
          {translate('SETTINGS_FIAT_SELECTION_LABEL')}{' '}
          <Tooltip tooltip={<span>{translate('SETTINGS_FIAT_SELECTION_TOOLTIP')}</span>} />
        </SubHeading>
        <SettingsControl>
          <SelectContainer>
            <select onChange={changeCurrencySelection} value={String(fiatCurrency)}>
              {Object.keys(Fiats).map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </SelectContainer>
        </SettingsControl>
      </SettingsField>
    </DashboardPanel>
  );
};

const mapStateToProps = (state: AppState) => ({
  inactivityTimer: getInactivityTimer(state),
  fiatCurrency: getFiat(state)
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      setInactivityTimer,
      setFiat
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

export default connector(GeneralSettings);
