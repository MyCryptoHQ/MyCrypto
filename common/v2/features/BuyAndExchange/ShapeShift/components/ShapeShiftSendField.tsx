import React from 'react';

interface Props {
  label: string;
  value: string;
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
  const fieldsetClassName = dark ? 'dark' : '';
  const inputClassName = `ShapeShiftWidget-input ${className}`;

  return (
    <fieldset className={fieldsetClassName}>
      <label>{label}</label>
      <section className="ShapeShiftWidget-input-wrapper">
        <input className={inputClassName} value={value} disabled={true} />
        {children}
      </section>
    </fieldset>
  );
}
