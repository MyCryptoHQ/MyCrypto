import { Query } from 'components/renderCbs';
import { setCurrentWindowSize, TSetCurrentWindowSize } from 'actions/transaction';
import { WindowSizeInputFactory } from './WindowSizeInputFactory';
import React from 'react';
import { connect } from 'react-redux';
import { ICurrentWindowSize } from 'selectors/transaction';

interface DispatchProps {
  setCurrentWindowSize: TSetCurrentWindowSize;
}

interface OwnProps {
  windowSize: string | null;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

export interface CallbackProps {
  isValid: boolean;
  readOnly: boolean;
  currentWindowSize: ICurrentWindowSize;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

type Props = DispatchProps & OwnProps;

class WindowSizeFieldFactoryClass extends React.Component<Props> {
  public componentDidMount() {
    const { windowSize } = this.props;
    if (windowSize) {
      this.props.setCurrentWindowSize(windowSize);
    }
  }

  public render() {
    return (
      <WindowSizeInputFactory onChange={this.setWindowSize} withProps={this.props.withProps} />
    );
  }

  private setWindowSize = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.setCurrentWindowSize(value);
  };
}

const WindowSizeFieldFactory = connect(null, { setCurrentWindowSize })(WindowSizeFieldFactoryClass);

interface DefaultWindowSizeFieldProps {
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const DefaultWindowSizeField: React.SFC<DefaultWindowSizeFieldProps> = ({ withProps }) => (
  <Query
    params={['windowSize']}
    withQuery={({ windowSize }) => (
      <WindowSizeFieldFactory windowSize={windowSize} withProps={withProps} />
    )}
  />
);

export { DefaultWindowSizeField as WindowSizeFieldFactory };
