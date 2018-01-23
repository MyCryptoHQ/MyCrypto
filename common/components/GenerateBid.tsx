import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { placeBidRequested, TPlaceBidRequested } from 'actions/ens';
import { getBidPlaceStage, getAllFieldsValid } from 'selectors/ens';
import { GenerateTransaction, SigningStatus } from 'components';
import Spinner from 'components/ui/Spinner';
import { GenerationStage } from 'reducers/ens/placeBid';

interface StateProps {
  bidPlaceStage: GenerationStage;
  allFieldsValid: boolean;
}

interface DispatchProps {
  placeBidRequested: TPlaceBidRequested;
}

type Props = DispatchProps & StateProps;

class GenerateBidClass extends Component<Props> {
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
        disabled={!allFieldsValid || this.props.bidPlaceStage === GenerationStage.ENCODING_BID_DATA}
      >
        Place A Bid
      </button>
    );

    const renderObj: { [key in GenerationStage]: JSX.Element } = {
      [GenerationStage.WAITING_ON_USER_INPUT]: bidGeneratorButton,
      [GenerationStage.ENCODING_BID_DATA]: bidGeneratorButton,
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
    return renderObj[this.props.bidPlaceStage];
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  bidPlaceStage: getBidPlaceStage(state),
  allFieldsValid: getAllFieldsValid(state)
});

export const GenerateBid = connect(mapStateToProps, {
  placeBidRequested
})(GenerateBidClass);
