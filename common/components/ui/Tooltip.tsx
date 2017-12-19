import React from 'react';
import './Tooltip.scss';

interface Props {
  children: React.ReactElement<string> | string;
}

const Tooltip: React.SFC<Props> = ({ children }) => (
  <div className="Tooltip">
    <span className="Tooltip-text">{children}</span>
  </div>
);

export default Tooltip;
