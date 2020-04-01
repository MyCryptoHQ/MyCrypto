import React from 'react';

import './Warning.scss';
import { isDesktop } from 'v2/utils';

interface WarningProps {
  highlighted?: boolean;
}

const Warning: React.SFC<WarningProps> = ({ highlighted, children }) => {
  const className = `Warning ${highlighted ? 'highlighted' : ''}`;
  const addMarginTop = isDesktop() ? 0 : "1em"; //Add extra margin to fix a small CSS issue of the warning being too close to the Banner

  return (
    <section className={className} style={{'marginTop': addMarginTop}}>
      <section className="Warning-icon">
        <i className="fa fa-exclamation-triangle" />
      </section>
      <section className="Warning-content">{children}</section>
    </section>
  );
};

export default Warning;
