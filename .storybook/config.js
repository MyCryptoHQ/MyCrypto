import React from 'react';
import { addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import StoryRouter from 'storybook-react-router';
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import styled from 'styled-components';
import { light, dark } from '@mycrypto/ui';

import { GAU_COLORS } from 'v2/theme';

import 'sass/styles'

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
addDecorator(StoryRouter())
