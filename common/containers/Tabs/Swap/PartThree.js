import React, { Component } from 'react';
import {
  SwapProgress,
  ReduxStateProps as SwapProgressReduxStateProps
} from './components/SwapProgress';

export default class PartThree extends Component {
  props: SwapProgressReduxStateProps
  render() {
    return (
      <div>
        {/*<SwapInfoHeader {...this.props} />*/}
        <SwapProgress {...this.props} />
      </div>
    );
  }
}
