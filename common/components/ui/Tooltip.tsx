import React from 'react';
import classnames from 'classnames';
import './Tooltip.scss';

interface Props {
  children: React.ReactElement<string> | string;
  size?: 'sm' | 'md' | 'lg';
}

const Tooltip: React.SFC<Props> = ({ size, children }) => (
  <div
    className={classnames({
      Tooltip: true,
      [`is-size-${size}`]: !!size
    })}
  >
    <span className="Tooltip-text">{children}</span>
  </div>
);

export default Tooltip;
