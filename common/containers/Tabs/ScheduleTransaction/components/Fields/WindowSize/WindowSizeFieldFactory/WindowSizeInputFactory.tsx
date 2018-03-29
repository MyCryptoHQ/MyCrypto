import React, { Component } from 'react';
import { Query } from 'components/renderCbs';
import {
  getCurrentWindowSize,
  ICurrentWindowSize,
  isValidCurrentWindowSize
} from 'selectors/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getResolvingDomain } from 'selectors/ens';
import { CallbackProps } from './WindowSizeFieldFactory';

interface StateProps {
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
    const { currentWindowSize, onChange, isValid, withProps } = this.props;

    return (
      <div className="row form-group">
        <div className="col-xs-11">
          <Query
            params={['readOnly']}
            withQuery={({ readOnly }) =>
              withProps({
                currentWindowSize,
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

export const WindowSizeInputFactory = connect((state: AppState) => ({
  currentWindowSize: getCurrentWindowSize(state),
  isResolving: getResolvingDomain(state),
  isValid: isValidCurrentWindowSize(state)
}))(WindowSizeInputFactoryClass);
