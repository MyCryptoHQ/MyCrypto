import React from 'react';

import './Overlay.scss';

interface Props {
  onClick(): void;
}

export default function Overlay({ onClick }: Props) {
  return <div onClick={onClick} className="Overlay" />;
}
