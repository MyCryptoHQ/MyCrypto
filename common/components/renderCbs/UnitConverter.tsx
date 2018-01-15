import { toTokenBase } from 'libs/units';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getDecimal } from 'selectors/transaction';

interface IChildren {
  onUserInput: UnitConverterClass['onUserInput'];
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
  onChange(baseUnit: IFakeEvent): void;
}

interface State {
  userInput: string;
}

const initialState = { userInput: '' };

class UnitConverterClass extends Component<Props, State> {
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

const mapStateToProps = (state: AppState) => {
  return {
    decimal: getDecimal(state)
  };
};

export const UnitConverter = connect(mapStateToProps)(UnitConverterClass);
