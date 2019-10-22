import React, { ChangeEvent, ReactElement } from 'react';

import './PrimaryToggle.scss';

export interface RadioOption {
  label: string | ReactElement<any>;
  value: string;
}

interface Props {
  options: RadioOption[];
  selectedValue: any;
  onChangeHandler(event: ChangeEvent<HTMLInputElement>): any;
}

const PrimaryToggle: React.SFC<Props> = ({ onChangeHandler, options, selectedValue }) => (
  <div className="PrimaryToggle">
    {options.map((option, index) => (
      <label
        key={index}
        className={`PrimaryToggle-label ${option.value === selectedValue ? 'active' : ''}`}
      >
        <input
          type="radio"
          className="PrimaryToggle-input"
          value={option.value}
          onChange={onChangeHandler}
          checked={option.value === selectedValue}
        />
        {option.label}
      </label>
    ))}
  </div>
);

export default PrimaryToggle;
