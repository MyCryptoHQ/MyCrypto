import { SagaIterator } from 'redux-saga';
import { all } from 'redux-saga/effects';
import { schedulingParamsValidity } from './paramsValidity';
import { currentWindowSize } from './currentWindowSize';
import { currentWindowStart } from './currentWindowStart';
import { currentScheduleTimestamp } from './currentScheduleTimestamp';
import { currentTimeBounty } from './currentTimeBounty';
import { currentSchedulingToggle } from './currentSchedulingToggle';
import { currentScheduleTimezone } from './currentScheduleTimezone';

export function* schedule(): SagaIterator {
  yield all([
    currentWindowSize,
    currentWindowStart,
    currentScheduleTimestamp,
    currentTimeBounty,
    currentSchedulingToggle,
    currentScheduleTimezone,
    schedulingParamsValidity
  ]);
}
