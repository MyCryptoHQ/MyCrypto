import React from 'react';
import { connect } from 'react-redux';

import { scheduleActions, scheduleSelectors } from 'features/schedule';
import { Query } from 'components/renderCbs';
import { WindowStartInputFactory } from './WindowStartInputFactory';

interface DispatchProps {
  setCurrentWindowStart: scheduleActions.TSetCurrentWindowStart;
}

interface OwnProps {
  windowStart: string | null;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

export interface CallbackProps {
  isValid: boolean;
  readOnly: boolean;
  currentWindowStart: scheduleSelectors.ICurrentWindowStart;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

type Props = DispatchProps & OwnProps;

class WindowStartFieldFactoryClass extends React.Component<Props> {
  public render() {
    return (
      <WindowStartInputFactory onChange={this.setWindowStart} withProps={this.props.withProps} />
    );
  }

  private setWindowStart = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.setCurrentWindowStart(value);
  };
}

const WindowStartFieldFactory = connect(null, {
  setCurrentWindowStart: scheduleActions.setCurrentWindowStart
})(WindowStartFieldFactoryClass);

interface DefaultWindowStartFieldProps {
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const DefaultWindowStartField: React.SFC<DefaultWindowStartFieldProps> = ({ withProps }) => (
  <Query
    params={['windowStart']}
    withQuery={({ windowStart }) => (
      <WindowStartFieldFactory windowStart={windowStart} withProps={withProps} />
    )}
  />
);

export { DefaultWindowStartField as WindowStartFieldFactory };
