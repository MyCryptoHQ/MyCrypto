import React from 'react';
import Select, { ReactSelectProps, Option } from 'react-select';

interface Props extends ReactSelectProps {
  className?: string;
  options: any;
  onChange: any;
  value: any;
}

interface State {
  selectedOption: any;
  hasBlurred: boolean;
}

export default class Dropdown extends React.Component<Props> {
  public state: State = {
    selectedOption: this.props.value || '',
    hasBlurred: false
  };
  //
  // public componentDidUpdate(_: Props, prevState: State) {
  //   const { value } = this.props;
  //   const { selectedOption } = prevState;
  //
  //   if (selectedOption !== value) {
  //     this.setState({ selectedOption: value });
  //   }
  // }

  public handleChange = (selectedOption: Option) => {
    this.setState({ selectedOption });
  };

  public formatOptions = (options: Option[]) => {
    if (typeof options[0] === 'object') {
      return options;
    }
    const formatted = options.map(opt => {
      return { value: opt, label: opt };
    });
    return formatted;
  };

  public render() {
    const { onChange, value } = this.props;
    let { selectedOption } = this.state;
    const options = this.formatOptions(this.props.options);

    if (!selectedOption && value) {
      selectedOption = value;
    }

    return (
      <Select
        // use ref to prevent <label /> from stealing focus when used inline with an input
        ref={el => {
          if (!!el && !!(el as any).control) {
            (el as any).control.addEventListener('click', (e: React.FormEvent<any>) => {
              e.preventDefault();
            });
          }
        }}
        {...this.props}
        className={`${this.props.className} ${this.state.hasBlurred ? 'has-blurred' : ''}`}
        value={selectedOption}
        onChange={obj => {
          this.handleChange(obj as any);
          onChange(obj as any);
        }}
        onBlur={e => {
          this.setState({ hasBlurred: true });
          if (this.props && this.props.onBlur) {
            this.props.onBlur(e);
          }
        }}
        options={options as any}
      />
    );
  }
}
