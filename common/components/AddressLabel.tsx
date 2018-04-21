import React from 'react';
import { connect } from 'react-redux';
import translate from 'translations';
import KeyCodes from 'shared/keycodes';
import { AppState } from 'reducers';
import { addLabelForAddress, AddressLabelPair } from 'actions/addressBook';
import { getLabels } from 'selectors/addressBook';
import { Input } from 'components/ui';
import './AddressLabel.scss';

interface AddressToLabelDictionary {
  [address: string]: string;
}

interface Props {
  address: string;
  labels: AddressToLabelDictionary;
  addLabelForAddress(addressLabelPair: AddressLabelPair): void;
}

interface State {
  mode: number;
}

enum AddressLabelModes {
  Button,
  Label,
  Input
}

interface RenderMethods {
  [mode: string]: () => JSX.Element;
}

class AddressLabel extends React.Component<Props> {
  public state: State = {
    mode: this.props.labels[this.props.address] ? AddressLabelModes.Label : AddressLabelModes.Button
  };

  private input: HTMLInputElement | null = null;

  public componentWillReceiveProps(nextProps: Props) {
    const { mode } = this.state;
    const { labels, address } = nextProps;
    const label = labels[address];

    if (mode === AddressLabelModes.Button && label) {
      return this.switchToLabelMode();
    }

    if (mode === AddressLabelModes.Label && !label) {
      return this.switchToButtonMode();
    }
  }

  public render() {
    const { mode } = this.state;
    const renderers: RenderMethods = {
      [AddressLabelModes.Button]: this.renderButton,
      [AddressLabelModes.Label]: this.renderLabel,
      [AddressLabelModes.Input]: this.renderInput
    };
    const render = renderers[mode];

    return <div className="AddressLabel">{render()}</div>;
  }

  private renderButton = () => {
    return (
      <button onClick={this.switchToInputMode} className="btn btn-default btn-smr">
        <span>
          <span className="AddressLabel-button-label hidden-xs">{translate('ADD_LABEL')}</span>
          <i className="fa fa-pencil" />
        </span>
      </button>
    );
  };

  private renderLabel = () => {
    const { labels, address } = this.props;
    const label = labels[address];

    return (
      <label onClick={this.switchToInputMode}>
        <i className="fa fa-pencil" /> {label}
      </label>
    );
  };

  private renderInput = () => {
    const { labels, address } = this.props;
    const label = labels[address] || '';

    return (
      <Input
        type="text"
        placeholder="Enter a label for your address"
        setInnerRef={this.setInputRef}
        value={label}
        onChange={this.handleChange}
        onBlur={this.switchToLabelMode}
        onKeyDown={this.handleKeyDown}
      />
    );
  };

  private switchToButtonMode = () => this.setState({ mode: AddressLabelModes.Button });

  private switchToLabelMode = () => this.setState({ mode: AddressLabelModes.Label });

  private switchToInputMode = () =>
    this.setState(
      { mode: AddressLabelModes.Input },
      // Focus and highlight the label when switching.
      () => this.input && (this.input.focus() || this.input.select())
    );

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { address } = this.props;
    const { target: { value: label } } = e;

    this.props.addLabelForAddress({
      address,
      label
    });
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.keyCode) {
      case KeyCodes.ENTER:
        return this.handleEnterKeyDown();
      default:
        return;
    }
  };

  private handleEnterKeyDown = () => this.input && this.input.blur();

  private setInputRef = (node: HTMLInputElement) => (this.input = node);
}

export default connect(
  (state: AppState) => ({
    labels: getLabels(state)
  }),
  { addLabelForAddress }
)(AddressLabel);
