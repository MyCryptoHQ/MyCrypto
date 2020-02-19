import { light, dark } from '@mycrypto/ui';
import { GAU_COLORS } from '../common/v2/theme/constants';
import { addDecorator } from '@storybook/react';
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import { withA11y } from '@storybook/addon-a11y';

const LIGHT_THEME = {
  name: 'Light',
  ...light,
  GAU: {
    COLORS: GAU_COLORS
  }
};

const DARK_THEME = {
  name: 'Dark',
  ...dark,
  GAU: {
    COLORS: GAU_COLORS
  }
};

addDecorator(withThemesProvider([LIGHT_THEME, DARK_THEME]));
addDecorator(withA11y);
