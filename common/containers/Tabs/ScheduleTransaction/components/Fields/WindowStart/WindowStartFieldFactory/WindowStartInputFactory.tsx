import React, { Component } from 'react';
import { Query } from 'components/renderCbs';
import {
  getCurrentWindowStart,
  ICurrentWindowStart,
  isValidCurrentWindowStart
} from 'selectors/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getResolvingDomain } from 'selectors/ens';
import { CallbackProps } from 'containers/Tabs/ScheduleTransaction/components/Fields/WindowStart/WindowStartFieldFactory';

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
      <div className="row form-group">
        <div className="col-xs-11">
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
        </div>
      </div>
    );
  }
}

export const WindowStartInputFactory = connect((state: AppState) => ({
  currentWindowStart: getCurrentWindowStart(state),
  isResolving: getResolvingDomain(state),
  isValid: isValidCurrentWindowStart(state)
}))(WindowStartInputFactoryClass);
