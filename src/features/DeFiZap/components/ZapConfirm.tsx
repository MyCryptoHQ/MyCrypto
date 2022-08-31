import { ConfirmTransaction } from '@components';
import { ITxConfig, ITxType } from '@types';

import { IZapConfig } from '../config';
import { ZapReceiptBanner } from './ZapReceiptBanner';

interface Props {
  zapSelected: IZapConfig;
  txConfig: ITxConfig;
  onComplete(): void;
}

export default function ZapConfirm({ zapSelected, txConfig, onComplete }: Props) {
  return (
    <ConfirmTransaction
      onComplete={onComplete}
      resetFlow={onComplete}
      txConfig={txConfig}
      txType={ITxType.DEFIZAP}
      customComponent={() => <ZapReceiptBanner zapSelected={zapSelected} />}
    />
  );
}
