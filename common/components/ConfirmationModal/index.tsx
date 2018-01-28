import {
  ConfirmationModalTemplate,
  OwnProps as ConfirmationModalTemplateProps
} from '../ConfirmationModalTemplate';
import { Details, Summary } from './components';
import React, { SFC } from 'react';

interface OwnProps {
  onClose: ConfirmationModalTemplateProps['onClose'];
}

export const ConfirmationModal: SFC<OwnProps> = ({ onClose }) => (
  <ConfirmationModalTemplate summary={<Summary />} details={<Details />} onClose={onClose} />
);
