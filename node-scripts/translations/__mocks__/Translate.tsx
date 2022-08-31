import { FC } from 'react';

import translate, { Trans, translateMarker, translateRaw } from '@translations';

const Translate: FC = () => {
  const translateTest2 = translate('TRANSLATE_TEST_2');
  const translateTest2Duplicate = translate('TRANSLATE_TEST_2');
  const translateTest2Reduplicate = translate('TRANSLATE_TEST_2');
  const translateTest3 = translate('TRANSLATE_TEST_3', { $var1: 'var-1' });

  const mapTranslationKey = (message: string) => {
    switch (message) {
      case 'success':
        return translateMarker('TRANSLATE_TEST_4');
      case 'error':
      default:
        return translateMarker('TRANSLATE_TEST_5');
    }
  };

  return (
    <div>
      {translateRaw('TRANSLATE_TEST_1')}
      {translateTest2}
      {translateTest2Duplicate}
      {translateTest2Reduplicate}
      {translateTest3}
      {translateRaw(mapTranslationKey('success'))}
      {translateRaw(mapTranslationKey('error'))}
      <Trans
        id="TRANSLATE_TEST_6"
        variables={{
          $var2: () => 'var-2'
        }}
      />
    </div>
  );
};

export default Translate;
