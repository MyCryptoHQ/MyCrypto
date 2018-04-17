import { Query } from 'components/renderCbs';
import { setCurrentWindowSize, TSetCurrentWindowSize } from 'actions/schedule';
import { WindowSizeInputFactory } from './WindowSizeInputFactory';
import React from 'react';
import { connect } from 'react-redux';
import {
  ICurrentWindowSize,
  ICurrentScheduleType,
  getCurrentScheduleType
} from 'selectors/schedule';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import { AppState } from 'reducers';

interface DispatchProps {
  setCurrentWindowSize: TSetCurrentWindowSize;
}

interface OwnProps {
  currentScheduleType: ICurrentScheduleType;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

interface OwnState {
  selectedScheduleType: ICurrentScheduleType;
}

export interface CallbackProps {
  currentWindowSize: ICurrentWindowSize;
  currentScheduleType: ICurrentScheduleType;
  isValid: boolean;
  readOnly: boolean;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

type Props = DispatchProps & OwnProps;
type State = OwnState;

class WindowSizeFieldFactoryClass extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      selectedScheduleType: props.currentScheduleType
    };
  }

  public componentDidMount() {
    this.adjustWindowSize(this.state.selectedScheduleType.value);
  }

  public componentDidUpdate() {
    const { currentScheduleType } = this.props;
    if (currentScheduleType !== this.state.selectedScheduleType) {
      this.adjustWindowSize(currentScheduleType.value);
      this.setState({
        selectedScheduleType: currentScheduleType
      });
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

  private adjustWindowSize = (schedulingType: string | null) => {
    if (schedulingType) {
      this.props.setCurrentWindowSize(
        schedulingType === 'time'
          ? EAC_SCHEDULING_CONFIG.WINDOW_SIZE_DEFAULT_TIME.toString()
          : EAC_SCHEDULING_CONFIG.WINDOW_SIZE_DEFAULT_BLOCK.toString()
      );
    }
  };
}

const WindowSizeFieldFactory = connect(
  (state: AppState) => ({
    currentScheduleType: getCurrentScheduleType(state)
  }),
  { setCurrentWindowSize }
)(WindowSizeFieldFactoryClass);

interface DefaultWindowSizeFieldProps {
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const DefaultWindowSizeField: React.SFC<DefaultWindowSizeFieldProps> = ({ withProps }) => (
  <Query
    params={['windowSize']}
    withQuery={() => <WindowSizeFieldFactory withProps={withProps} />}
  />
);

export { DefaultWindowSizeField as WindowSizeFieldFactory };
