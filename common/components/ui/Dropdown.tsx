import React from 'react';
import Select, { ReactSelectProps } from 'react-select';

interface Props {
  className?: string;
  options: any;
  onChange: any;
}

export default class Dropdown extends React.Component<ReactSelectProps & Props> {
  public state = {
    selectedOption: { value: '', label: '' }
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
        value={value}
        onChange={obj => {
          this.handleChange(obj);
          onChange();
        }}
        {...this.props}
        options={this.formatOptions(this.props.options)}
      />
    );
  }
}
