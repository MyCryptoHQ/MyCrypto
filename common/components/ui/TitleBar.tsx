import React from 'react';
import { Aux } from './AuxComponent';
import './TitleBar.scss';

const TitleBar: React.SFC<{}> = () => (
  <Aux>
    <div className="TitleBar" />
    <div className="TitleBarPlaceholder" />
  </Aux>
);

export default TitleBar;
