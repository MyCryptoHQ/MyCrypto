import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import {
  getCurrentWindowSize,
  ICurrentWindowSize,
  isValidCurrentWindowSize,
  getCurrentScheduleType,
  ICurrentScheduleType
} from 'features/schedule/selectors';
import { getResolvingDomain } from 'features/ens/selectors';
import { Query } from 'components/renderCbs';
import { CallbackProps } from './WindowSizeFieldFactory';

interface StateProps {
  currentScheduleType: ICurrentScheduleType;
  currentWindowSize: ICurrentWindowSize;
  isValid: boolean;
  isResolving: boolean;
}

interface OwnProps {
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = OwnProps & StateProps;

class WindowSizeInputFactoryClass extends Component<Props> {
  public render() {
    const { currentWindowSize, currentScheduleType, onChange, isValid, withProps } = this.props;

    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) =>
          withProps({
            currentWindowSize,
            currentScheduleType,
            isValid,
            onChange,
            readOnly: !!readOnly || this.props.isResolving
          })
        }
      />
    );
  }
}

export const WindowSizeInputFactory = connect((state: AppState) => ({
  currentWindowSize: getCurrentWindowSize(state),
  currentScheduleType: getCurrentScheduleType(state),
  isResolving: getResolvingDomain(state),
  isValid: isValidCurrentWindowSize(state)
}))(WindowSizeInputFactoryClass);
