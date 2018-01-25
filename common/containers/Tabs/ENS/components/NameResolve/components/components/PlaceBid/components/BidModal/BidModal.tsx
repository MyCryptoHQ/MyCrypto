import {
  ConfirmationModalTemplate,
  OwnProps as ConfirmationModalTemplateProps
} from 'components/ConfirmationModalTemplate';
import { Summary } from 'components/ConfirmationModal/components';
import { Details, ModalHeader } from './components/Details';
import React from 'react';
import './Modals.scss';

interface OwnProps {
  onClose: ConfirmationModalTemplateProps['onClose'];
}

export const BidModal: React.SFC<OwnProps> = ({ onClose }) => (
  <ConfirmationModalTemplate
    summary={
      <>
        {ModalHeader} <Summary />
      </>
    }
    details={<Details />}
    onClose={onClose}
  />
);
