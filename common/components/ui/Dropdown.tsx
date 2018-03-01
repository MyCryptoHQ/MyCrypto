import React from 'react';
import Select, { ReactSelectProps } from 'react-select';

interface Props extends ReactSelectProps {
  className?: string;
  options: any;
  onChange: any;
}

export default class Dropdown extends React.Component<Props> {
  public state = {
    selectedOption: { value: '', label: '' },
    hasBlurred: false
  };

  public handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  public formatOptions = options => {
    if (typeof options[0] === 'object') {
      return options;
    }
    const formatted = options.map(opt => {
      return { value: opt, label: opt };
    });
    return formatted;
  };

  public render() {
    const { onChange } = this.props;
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
    const options = this.formatOptions(this.props.options);

    return (
      <Select
        // use ref to prevent <label /> from stealing focus when used inline with an input
        ref={el => {
          if (!!el && !!(el as any).control) {
            (el as any).control.addEventListener('click', e => {
              e.preventDefault();
            });
          }
        }}
        className={`${this.props.className} ${this.state.hasBlurred ? 'has-blurred' : ''}`}
        value={value}
        onChange={obj => {
          this.handleChange(obj);
          onChange();
        }}
        {...this.props}
        onBlur={e => {
          this.setState({ hasBlurred: true });
          if (this.props && this.props.onBlur) {
            this.props.onBlur(e);
          }
        }}
        options={options}
      />
    );
  }
}
