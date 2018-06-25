import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { scheduleSelectors } from 'features/schedule';
import { ensSelectors } from 'features/ens';
import { Query } from 'components/renderCbs';
import { CallbackProps } from './WindowStartFieldFactory';

interface StateProps {
  currentWindowStart: scheduleSelectors.ICurrentWindowStart;
  isValid: boolean;
  isResolving: boolean;
}

interface OwnProps {
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = OwnProps & StateProps;

class WindowStartInputFactoryClass extends Component<Props> {
  public render() {
    const { currentWindowStart, onChange, isValid, withProps } = this.props;

    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) =>
          withProps({
            currentWindowStart,
            isValid,
            onChange,
            readOnly: !!readOnly || this.props.isResolving
          })
        }
      />
    );
  }
}

export const WindowStartInputFactory = connect((state: AppState) => ({
  currentWindowStart: scheduleSelectors.getCurrentWindowStart(state),
  isResolving: ensSelectors.getResolvingDomain(state),
  isValid: selectors.isValidCurrentWindowStart(state)
}))(WindowStartInputFactoryClass);
