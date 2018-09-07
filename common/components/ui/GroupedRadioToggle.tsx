import React, { ChangeEvent } from 'react';

import './GroupedRadioToggle.scss';

interface Props {
  isValid?: boolean;
  options: string[];
  selectedValue: any;

  onChangeHandler(event: ChangeEvent<HTMLInputElement>): any;
}

const GroupedRadioToggle: React.SFC<Props> = ({
  isValid,
  options,
  selectedValue,
  onChangeHandler
}) => (
  <div className={`GroupedRadioToggle ${!isValid ? 'invalid' : ''}`}>
    {options.map((option, index) => (
      <label
        key={index}
        className={`GroupedRadioToggle-button btn btn-default ${
          option === selectedValue ? 'active' : ''
        }`}
      >
        <input
          type="radio"
          className="GroupedRadioToggle-input"
          value={option}
          onChange={onChangeHandler}
          checked={option === selectedValue}
        />&nbsp;{option}
      </label>
    ))}
  </div>
);

export default GroupedRadioToggle;
