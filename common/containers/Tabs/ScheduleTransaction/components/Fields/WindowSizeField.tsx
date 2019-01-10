import React from 'react';
import { connect } from 'react-redux';

import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import { AppState } from 'features/reducers';
import { scheduleActions, scheduleSelectors } from 'features/schedule';
import translate, { translateRaw } from 'translations';
import { Tooltip, Input } from 'components/ui';
import Help from 'components/ui/Help';

interface Props {
  currentScheduleType: scheduleSelectors.ICurrentScheduleType;
  currentWindowSize: scheduleSelectors.ICurrentWindowSize;
  isValid: boolean;

  setCurrentWindowSize: scheduleActions.TSetCurrentWindowSize;
}

class WindowSizeFieldClass extends React.Component<Props> {
  public render() {
    const { currentScheduleType, isValid, currentWindowSize } = this.props;

    return (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">
            <span className="ScheduleFields-field-title">
              <div className="ScheduleFields-field-title-text">
                {translate('SCHEDULE_WINDOW_SIZE')}
              </div>
              <div className="ScheduleFields-field-title-tooltip">
                <Tooltip>
                  {translateRaw(
                    `SCHEDULE_WINDOW_SIZE_TOOLTIP_${
                      currentScheduleType.value === 'time' ? 'TIME' : 'BLOCK'
                    }`
                  )}
                </Tooltip>
                <Help className="ScheduleFields-field-title-help" />
              </div>
            </span>
          </div>
          <Input
            isValid={isValid}
            type="text"
            value={currentWindowSize.raw}
            placeholder={
              currentScheduleType.value === 'time'
                ? EAC_SCHEDULING_CONFIG.WINDOW_SIZE_DEFAULT_TIME.toString()
                : EAC_SCHEDULING_CONFIG.WINDOW_SIZE_DEFAULT_BLOCK.toString()
            }
            spellCheck={false}
            onChange={this.setWindowSize}
            showInvalidWithoutValue={true}
          />
        </label>
      </div>
    );
  }

  private setWindowSize = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.setCurrentWindowSize(value);
  };
}

export const WindowSizeField = connect(
  (state: AppState) => ({
    currentScheduleType: scheduleSelectors.getCurrentScheduleType(state),
    currentWindowSize: scheduleSelectors.getCurrentWindowSize(state),
    isValid: scheduleSelectors.isValidCurrentWindowSize(state)
  }),
  { setCurrentWindowSize: scheduleActions.setCurrentWindowSize }
)(WindowSizeFieldClass);
