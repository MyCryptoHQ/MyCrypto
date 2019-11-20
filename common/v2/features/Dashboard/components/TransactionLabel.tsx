import React from 'react';
import moment from 'moment';
import { Typography } from '@mycrypto/ui';

import './TransactionLabel.scss';

interface Props {
  image: JSX.Element;
  label: string;
  stage: string;
  date: number;
}

const capitalize = (word: string): string =>
  word
    .split('')
    .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
    .join('');

const formatDate = (date: number): string => moment.unix(date).format('MM/DD/YY h:mm A');

export default function TransactionLabel({ image, label, stage, date }: Props) {
  return (
    <div className="TransactionLabel">
      {image}
      <div className="TransactionLabel-info">
        <Typography className="TransactionLabel-info-label">{label}</Typography>
        <Typography className="TransactionLabel-info-stageDate">
          {`${capitalize(stage)} ${date ? ` - ${formatDate(date)}` : ''}`}
        </Typography>
      </div>
    </div>
  );
}
