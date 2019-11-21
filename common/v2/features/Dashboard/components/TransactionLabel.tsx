import React from 'react';
import moment from 'moment';
import { Typography } from '@mycrypto/ui';
import { ITxStatus } from 'v2/types';

import './TransactionLabel.scss';
import styled from 'styled-components';

interface Props {
  image: JSX.Element;
  label: string;
  stage: ITxStatus;
  date: number;
}

interface Config {
  color: string;
}

const capitalize = (word: string): string =>
  word
    .split('')
    .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
    .join('');

const formatDate = (date: number): string => moment.unix(date).format('MM/DD/YY h:mm A');

const getColor = (txStatus: ITxStatus) => {
  switch (txStatus) {
    case ITxStatus.FAILED:
      return '#F05424';
    case ITxStatus.SUCCESS:
      return '#75b433';
    case ITxStatus.PENDING:
      return '#424242';
  }
};

const getConfig = (txStatus: ITxStatus): Config => {
  return {
    color: getColor(txStatus)
  };
};

const SStage = styled(Typography)`
  color: ${(p: { config: Config }) => p.config.color || 'transparent'};
`;
export default function TransactionLabel({ image, label, stage, date }: Props) {
  const config = getConfig(stage);
  return (
    <div className="TransactionLabel">
      {image}
      <div className="TransactionLabel-info">
        <Typography className="TransactionLabel-info-label">{label}</Typography>
        <SStage config={config} className="TransactionLabel-info-stage">
          {capitalize(stage)}{' '}
        </SStage>
        <Typography className="TransactionLabel-info-Date">{`${
          date ? ` - ${formatDate(date)}` : ''
        }`}</Typography>
      </div>
    </div>
  );
}
