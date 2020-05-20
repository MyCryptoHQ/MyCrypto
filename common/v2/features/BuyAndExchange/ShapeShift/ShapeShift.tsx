import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import ShapeshiftDisabled from './ShapeShiftDisabled';

export class ShapeShift extends Component<RouteComponentProps<any>> {
  public render() {
    return <ShapeshiftDisabled />;
  }
}

export default withRouter(ShapeShift);
