import React from 'react';
import noop from 'lodash/noop';

interface Props {
  enabled: boolean;
  onClick(): void;
}

export default function CustomRadio({ onClick, enabled = false }: Props) {
  return (
    <section className="CustomRadio" onClick={enabled ? noop : onClick}>
      {enabled && <section className="CustomRadio-inner" />}
    </section>
  );
}
