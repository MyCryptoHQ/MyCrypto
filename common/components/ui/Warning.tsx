import React from 'react';

import './Warning.scss';

interface WarningProps {
  children: any;
}

export default function Warning(props: WarningProps) {
  return (
    <section className="Warning">
      <section className="Warning-icon">
        <i className="fa fa-exclamation-triangle" />
      </section>
      <section className="Warning-content">{props.children}</section>
    </section>
  );
}
