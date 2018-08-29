import React from 'react';

import './Modal.scss';

const Modal: React.StatelessComponent<{}> = ({ children }) => {
  return (
    <section className="Modalz">
      <section className="Modalz-content">{children}</section>
    </section>
  );
};

export default Modal;
