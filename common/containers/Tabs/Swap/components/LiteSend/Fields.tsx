import React, { Component } from 'react';
import { AmountFieldFactory } from 'components/AmountFieldFactory';
import { GasFieldFactory } from 'components/GasFieldFactory';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { configureLiteSend, TConfigureLiteSend } from 'actions/swap';

interface DispatchProps {
  configureLiteSend: TConfigureLiteSend;
}

class FieldsClass extends Component<DispatchProps> {
  public componentDidMount() {
    this.props.configureLiteSend();
  }

  public render() {
    return null;
  }
}

export const Fields = connect(null, { configureLiteSend })(FieldsClass);
