import React from 'react';

import './ShapeShiftSendField.scss';

interface Props {
  label?: string;
  value?: string;
  children?: any;
  dark?: boolean;
  className?: string;
}

export default function ShapeShiftSendField({
  dark,
  label,
  value,
  className = '',
  children
}: Props) {
  const fieldsetClassName = `ShapeShiftSendField ${dark ? 'dark' : ''}`;
  const inputClassName = `ShapeShiftWidget-input ${className}`;

  return (
    <fieldset className={fieldsetClassName}>
      {label && <label>{label}</label>}
      <section className="ShapeShiftWidget-input-wrapper">
        {value && <p className={inputClassName}>{value}</p>}
        {children}
      </section>
    </fieldset>
  );
}
