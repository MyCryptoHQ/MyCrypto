import { toTokenBase } from 'libs/units';

import React, { Component } from 'react';

interface IChildren {
  onUserInput: UnitConverter['onUserInput'];
  convertedUnit: string;
}
interface IFakeEvent {
  currentTarget: {
    value: string;
  };
}

export interface Props {
  decimal: number;
  children({ onUserInput, convertedUnit }: IChildren): React.ReactElement<any>;
  onChange(baseUnit: IFakeEvent);
}

interface State {
  userInput: string;
}

const initialState = { userInput: '' };

export class UnitConverter extends Component<Props, State> {
  public state: State = initialState;

  public componentWillReceiveProps(nextProps: Props) {
    const { userInput } = this.state;

    if (this.props.decimal !== nextProps.decimal) {
      this.baseUnitCb(userInput, nextProps.decimal);
    }
  }

  public onUserInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const { decimal } = this.props;
    this.baseUnitCb(value, decimal);
    this.setState({ userInput: value });
  };

  public render() {
    return this.props.children({
      onUserInput: this.onUserInput,
      convertedUnit: this.state.userInput
    });
  }
  private baseUnitCb = (value: string, decimal: number) => {
    const baseUnit = toTokenBase(value, decimal).toString();
    const fakeEvent = {
      currentTarget: {
        value: baseUnit
      }
    };
    this.props.onChange(fakeEvent);
  };
}
