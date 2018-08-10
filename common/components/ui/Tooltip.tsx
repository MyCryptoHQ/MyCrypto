import React from 'react';
import classnames from 'classnames';

import './Tooltip.scss';

interface Props {
  children: React.ReactElement<string> | string;
  size?: 'sm' | 'md' | 'lg';
  direction?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.SFC<Props> = ({ size, direction, children }) => (
  <div
    className={classnames({
      Tooltip: true,
      [`is-size-${size}`]: !!size,
      [`is-direction-${direction}`]: !!direction
    })}
  >
    <span className="Tooltip-text">{children}</span>
  </div>
);

export default Tooltip;
