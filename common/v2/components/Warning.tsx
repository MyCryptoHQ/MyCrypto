import React from 'react';

import './Warning.scss';

interface WarningProps {
  highlighted?: boolean;
}

const Warning: React.FC<WarningProps> = ({ highlighted, children }) => {
  const className = `Warning ${highlighted ? 'highlighted' : ''}`;

  return (
    <section className={className}>
      <section className="Warning-icon">
        <i className="fa fa-exclamation-triangle" />
      </section>
      <section className="Warning-content">{children}</section>
    </section>
  );
};

export default Warning;
