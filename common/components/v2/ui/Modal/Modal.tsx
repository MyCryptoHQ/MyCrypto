import React from 'react';

import './Modal.scss';

export default function Modal({ children }) {
  return (
    <section className="Modalz">
      <section className="Modalz-content">{children}</section>
    </section>
  );
}
