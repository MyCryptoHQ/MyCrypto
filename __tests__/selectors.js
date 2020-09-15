import { Selector } from 'testcafe';

import { getTransValueByKey } from './translation-utils';

export const selectMnemonicInput = Selector(
  `input[placeholder="${getTransValueByKey('MNEMONIC_ENTER_PHRASE')}"]`
).parent();
