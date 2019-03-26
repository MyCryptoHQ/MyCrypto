import React from 'react';

import './Modal.scss';

const Modal: React.StatelessComponent<{}> = ({ children }) => {
  return <section className="Modalz">{children}</section>;
};

export default Modal;
