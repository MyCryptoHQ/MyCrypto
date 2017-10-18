import React, { Component } from 'react';
import './Code.scss';

const Code = ({ children }) => (
  <pre>
    <code>{children}</code>
  </pre>
);

export default Code;
