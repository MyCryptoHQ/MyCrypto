import React, { Component } from 'react';
import {
  ReceivingAddress,
  ReduxStateProps as ReceivingAddressReduxStateProps,
  ReduxActionProps as ReceivingAddressReduxActionProps
} from './components/ReceivingAddress';
import {
  SwapInfoHeader,
  ReduxStateProps as SwapInfoHeaderReduxStateProps,
  ReduxActionProps as SwapInfoHeaderReduxActionProps
} from './components/SwapInfoHeader';

export default class PartTwo extends Component {
  props: ReceivingAddressReduxStateProps &
    ReceivingAddressReduxActionProps &
    SwapInfoHeaderReduxStateProps &
    SwapInfoHeaderReduxActionProps;

  render() {
    const {
      // SwapInfoHeader Props
      referenceNumber,
      timeRemaining,
      originAmount,
      originKind,
      destinationAmount,
      restartSwap,
      // ReceivingAddress Props
      destinationAddress,
      destinationAddressSwap,
      changeStepSwap,
      stopLoadBityRatesSwap,
      // ReceivingAddress & SwapInfoHeader Props
      destinationKind,


      referenceNumberSwap

    } = this.props;

    const SwapInfoHeaderProps = {
      referenceNumber,
      timeRemaining,
      originAmount,
      originKind,
      destinationKind,
      destinationAmount,
      restartSwap
    };

    const ReceivingAddressProps = {
      destinationKind,
      destinationAddress,
      destinationAddressSwap,
      changeStepSwap,
      stopLoadBityRatesSwap,


      referenceNumberSwap
    };

    return (
      <div>
        {/*<SwapInfoHeader {...SwapInfoHeaderProps} />*/}
        <ReceivingAddress {...ReceivingAddressProps} />
      </div>
    );
  }
}
