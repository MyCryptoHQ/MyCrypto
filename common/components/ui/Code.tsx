import React from 'react';
import './Code.scss';

const Code = ({ children }: React.Props<{}>) => (
  <pre>
    <code>{children}</code>
  </pre>
);

export default Code;
