import React from 'react';
import { connect } from 'react-redux';

import { setCurrentTimeBounty, TSetCurrentTimeBounty, ICurrentTimeBounty } from 'features/schedule';
import { Query } from 'components/renderCbs';
import { TimeBountyInputFactory } from './TimeBountyInputFactory';

interface DispatchProps {
  setCurrentTimeBounty: TSetCurrentTimeBounty;
}

interface OwnProps {
  timeBounty: string | null;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

export interface CallbackProps {
  isValid: boolean;
  readOnly: boolean;
  currentTimeBounty: ICurrentTimeBounty;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

type Props = DispatchProps & OwnProps;

class TimeBountyFieldFactoryClass extends React.Component<Props> {
  public componentDidMount() {
    const { timeBounty } = this.props;
    if (timeBounty) {
      this.props.setCurrentTimeBounty(timeBounty);
    }
  }

  public render() {
    return (
      <TimeBountyInputFactory onChange={this.setTimeBounty} withProps={this.props.withProps} />
    );
  }

  private setTimeBounty = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.setCurrentTimeBounty(value);
  };
}

const TimeBountyFieldFactory = connect(null, { setCurrentTimeBounty })(TimeBountyFieldFactoryClass);

interface DefaultTimeBountyFieldProps {
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const DefaultTimeBountyField: React.SFC<DefaultTimeBountyFieldProps> = ({ withProps }) => (
  <Query
    params={['timeBounty']}
    withQuery={({ timeBounty }) => (
      <TimeBountyFieldFactory timeBounty={timeBounty} withProps={withProps} />
    )}
  />
);

export { DefaultTimeBountyField as TimeBountyFieldFactory };
