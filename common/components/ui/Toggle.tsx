import React, { ChangeEvent } from 'react';
import './Toggle.scss';

interface Props {
  checked: boolean;
  onChangeHandler(event: ChangeEvent<HTMLInputElement>): any;
}

const Toggle: React.SFC<Props> = ({ checked, onChangeHandler }) => (
  <label className="Toggle checkbox">
    <input className="Toggle-input" type="checkbox" checked={checked} onChange={onChangeHandler} />
    <span className="Toggle-slider round" />
  </label>
);

export default Toggle;
