import React from 'react';

import { Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { ITxStatus } from '@types';
import { formatDateTime } from '@utils';

import './TransactionLabel.scss';

interface Props {
  image: JSX.Element;
  label: string;
  stage: ITxStatus;
  date: number;
}

const capitalize = (word: string): string =>
  word
    .split('')
    .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
    .join('');

type ITxStatusConfig = { [K in ITxStatus]: { color: string } };

const txStatusConfig: ITxStatusConfig = {
  [ITxStatus.SUCCESS]: { color: '#75b433' },
  [ITxStatus.FAILED]: { color: '#F05424' },
  [ITxStatus.PENDING]: { color: '#424242' },
  [ITxStatus.UNKNOWN]: { color: '#424242' },
  [ITxStatus.EMPTY]: { color: '#424242' },
  [ITxStatus.PREPARING]: { color: '#424242' },
  [ITxStatus.READY]: { color: '#424242' },
  [ITxStatus.SIGNED]: { color: '#424242' },
  [ITxStatus.BROADCASTED]: { color: '#424242' },
  [ITxStatus.CONFIRMING]: { color: '#424242' },
  [ITxStatus.CONFIRMED]: { color: '#75b433' }
};

const SStage = styled(Typography)`
  color: ${(p: { color: string }) => p.color || 'transparent'};
`;

export default function TransactionLabel({ image, label, stage, date }: Props) {
  const config = txStatusConfig[stage];
  return (
    <div className="TransactionLabel">
      {image}
      <div className="TransactionLabel-info">
        <Typography className="TransactionLabel-info-label">{label}</Typography>
        <SStage color={config.color} className="TransactionLabel-info-stage">
          {capitalize(stage)}{' '}
        </SStage>
        <Typography className="TransactionLabel-info-Date">{`${
          date ? ` - ${formatDateTime(date)}` : ''
        }`}</Typography>
      </div>
    </div>
  );
}
