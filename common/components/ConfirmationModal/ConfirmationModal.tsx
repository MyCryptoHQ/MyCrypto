import { Body } from './components';
import {
  ConfirmationModalTemplate,
  OwnProps as TemplateProps
} from 'components/ConfirmationModalTemplate';
import React from 'react';
import { Omit } from 'react-redux';
type Props = Omit<TemplateProps, 'Body'>;

export const ConfirmationModal: React.SFC<Props> = props => (
  <ConfirmationModalTemplate Body={<Body />} {...props} />
);
