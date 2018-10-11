import React from 'react';
import noop from 'lodash/noop';

import CustomRadio from './CustomRadio';

interface Props {
  name: string;
  isSelected: boolean;
  onClick(e: React.MouseEvent<HTMLElement>): void;
}

export default function NodeOption({ onClick, name, isSelected = false }: Props) {
  return (
    <li className="NewNodeOption" onClick={onClick}>
      <CustomRadio enabled={isSelected} onClick={noop} /> {name}
    </li>
  );
}
