import React, { Component } from 'react';
import { Query } from 'components/renderCbs';
import {
  getCurrentTimeBounty,
  ICurrentTimeBounty,
  isValidCurrentTimeBounty
} from 'selectors/schedule';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { CallbackProps } from 'containers/Tabs/ScheduleTransaction/components/Fields/TimeBounty/TimeBountyFieldFactory';

interface StateProps {
  currentTimeBounty: ICurrentTimeBounty;
  isValid: boolean;
}

interface OwnProps {
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = OwnProps & StateProps;

class TimeBountyInputFactoryClass extends Component<Props> {
  public render() {
    const { currentTimeBounty, isValid, onChange, withProps } = this.props;

    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) =>
          withProps({
            currentTimeBounty,
            isValid: !!currentTimeBounty.value && isValid,
            readOnly: !!readOnly,
            onChange
          })
        }
      />
    );
  }
}

export const TimeBountyInputFactory = connect((state: AppState) => ({
  currentTimeBounty: getCurrentTimeBounty(state),
  isValid: isValidCurrentTimeBounty(state)
}))(TimeBountyInputFactoryClass);
