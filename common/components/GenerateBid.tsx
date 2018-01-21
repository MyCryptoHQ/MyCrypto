import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { placeBidRequested, TPlaceBidRequested } from 'actions/ens';
import { getBidPlaceFailed, getBidPlaceSucceeded, getAllFieldsValid } from 'selectors/ens';
import { GenerateTransaction, SigningStatus } from 'components';
import Spinner from 'components/ui/Spinner';

interface StateProps {
  bidPlaceFailed: boolean;
  bidPlaceSucceeded: boolean;
  allFieldsValid: boolean;
}

interface DispatchProps {
  placeBidRequested: TPlaceBidRequested;
}

type Props = DispatchProps & StateProps;

enum GenerationStage {
  WAITING_ON_USER_INPUT = 'WAITING_ON_USER_INPUT',
  ENCODING_BID_DATA = 'ENCODING_BID_DATA',
  READY_TO_GENERATE_TRANSACTION = 'READY_TO_GENERATE_TRANSACTION',
  FAILED = 'FAILED'
}

interface State {
  stage: GenerationStage;
}

class GenerateBidClass extends Component<Props, State> {
  public state: State = {
    stage: GenerationStage.WAITING_ON_USER_INPUT
  };

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.bidPlaceSucceeded) {
      this.setState({ stage: GenerationStage.READY_TO_GENERATE_TRANSACTION });
    } else if (nextProps.bidPlaceFailed) {
      this.setState({ stage: GenerationStage.FAILED });
    }
  }

  public handleOnClick = () => {
    this.props.placeBidRequested();
    this.setState({ stage: GenerationStage.ENCODING_BID_DATA });
  };

  public render() {
    const { allFieldsValid } = this.props;
    const bidGeneratorButton = (
      <button
        className="btn btn-info btn-block"
        onClick={this.handleOnClick}
        disabled={!allFieldsValid}
      >
        Place A Bid
      </button>
    );

    const renderObj: { [key in GenerationStage]: JSX.Element } = {
      [GenerationStage.WAITING_ON_USER_INPUT]: bidGeneratorButton,
      [GenerationStage.ENCODING_BID_DATA]: <Spinner />,
      [GenerationStage.READY_TO_GENERATE_TRANSACTION]: (
        <>
          <SigningStatus />
          <GenerateTransaction />
        </>
      ),
      [GenerationStage.FAILED]: (
        <> Bid generation failed, please try again :D {bidGeneratorButton}</>
      )
    };
    return renderObj[this.state.stage];
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  bidPlaceFailed: getBidPlaceFailed(state),
  bidPlaceSucceeded: getBidPlaceSucceeded(state),
  allFieldsValid: getAllFieldsValid(state)
});

export const GenerateBid = connect(mapStateToProps, {
  placeBidRequested
})(GenerateBidClass);
