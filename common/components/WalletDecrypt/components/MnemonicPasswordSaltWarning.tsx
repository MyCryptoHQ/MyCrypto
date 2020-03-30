import React from 'react';

import { translateRaw } from 'translations';
import { Tooltip } from 'components/ui';
import './MnemonicPasswordSaltWarning.scss';

const MnemonicPasswordSaltWarning: React.SFC = () => (
  <div className="MnemonicPasswordSaltWarning">
    <i className="fa fa-question-circle" aria-label="More info" />
    <Tooltip direction="top">{translateRaw('MNEMONIC_SALT_PASSWORD')}</Tooltip>
  </div>
);

export default MnemonicPasswordSaltWarning;
