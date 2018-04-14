import React, { Component } from 'react';
import { Query } from 'components/renderCbs';
import {
  getCurrentWindowStart,
  ICurrentWindowStart,
  isValidCurrentWindowStart
} from 'selectors/schedule';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getResolvingDomain } from 'selectors/ens';
import { CallbackProps } from './WindowStartFieldFactory';

interface StateProps {
  currentWindowStart: ICurrentWindowStart;
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
  currentWindowStart: getCurrentWindowStart(state),
  isResolving: getResolvingDomain(state),
  isValid: isValidCurrentWindowStart(state)
}))(WindowStartInputFactoryClass);
