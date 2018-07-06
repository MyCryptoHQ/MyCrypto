import React from 'react';
import { Omit } from 'react-redux';

import {
  ConfirmationModalTemplate,
  OwnProps as TemplateProps
} from 'components/ConfirmationModalTemplate';
import { Body } from './components';

type Props = Omit<TemplateProps, 'Body'>;

export const ConfirmationModal: React.SFC<Props> = props => (
  <ConfirmationModalTemplate Body={<Body />} {...props} />
);
