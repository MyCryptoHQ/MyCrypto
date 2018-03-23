import React, { PureComponent } from 'react';
import './SwapDropdown.scss';
import { DropDown } from 'components/ui';

export interface SingleCoin {
  id: string;
  name: string;
  image: string;
  status: string;
}

interface Props<T> {
  options: SingleCoin[];
  value: string;
  onChange(value: T): void;
}

const ValueComp: React.SFC = (props: any) => {
  return (
    <div className={`${props.className} swap-option-wrapper`}>
      <img src={props.value.img} className="swap-option-img" alt={props.value.label + ' logo'} />
      <span className="swap-option-label">{props.value.label}</span>
    </div>
  );
};

const OptionComp: React.SFC = (props: any) => {
  const handleMouseDown = (event: React.MouseEvent<any>) => {
    event.preventDefault();
    event.stopPropagation();
    props.onSelect(props.option, event);
  };
  const handleMouseEnter = (event: React.MouseEvent<any>) => {
    props.onFocus(props.option, event);
  };
  const handleMouseMove = (event: React.MouseEvent<any>) => {
    if (props.isFocused) {
      return;
    }
    props.onFocus(props.option, event);
  };
  return (
    <div
      className={`${props.className} swap-option-wrapper`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
    >
      <img src={props.option.img} className="swap-option-img" alt={props.option.label + ' logo'} />
      <span className="swap-option-label">{props.option.label}</span>
    </div>
  );
};

class SwapDropdown<T> extends PureComponent<Props<T>> {
  public render() {
    const { options, value, onChange } = this.props;
    const mappedOptions = options.map(opt => {
      return { label: opt.id, value: opt.name, img: opt.image, status: opt.status };
    });
    return (
      <DropDown
        className="Swap-dropdown"
        options={mappedOptions}
        optionComponent={(props: any) => {
          return <OptionComp {...props} />;
        }}
        value={value}
        clearable={false}
        onChange={onChange}
        valueComponent={(props: any) => {
          return <ValueComp {...props} />;
        }}
      />
    );
  }
}

export default SwapDropdown;
