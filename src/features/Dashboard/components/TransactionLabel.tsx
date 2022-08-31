import { Body, Box } from '@components';
import { ITxStatus } from '@types';
import { formatDateTime } from '@utils';

interface Props {
  image: JSX.Element;
  label: string;
  stage: ITxStatus;
  date: number;
}

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

export default function TransactionLabel({ image, label, stage, date }: Props) {
  const config = txStatusConfig[stage];
  return (
    <Box variant="rowAlign">
      {image}
      <div>
        <Body as="span">{label}</Body>
        <div>
          <Body as="span" color={config.color || 'transparent'} textTransform="capitalize">
            {stage}{' '}
          </Body>
          <Body as="span">{`${date ? ` - ${formatDateTime(date)}` : ''}`}</Body>
        </div>
      </div>
    </Box>
  );
}
