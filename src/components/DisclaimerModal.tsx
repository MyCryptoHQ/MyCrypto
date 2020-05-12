import React from 'react';

import { KB_HELP_ARTICLE } from '@config';
import translate, { translateRaw } from '@translations';

import { LegacyModal, IButton, HelpLink } from '@components';
import './DisclaimerModal.scss';

interface Props {
  isOpen: boolean;
  handleClose(): void;
}

const DisclaimerModal: React.FC<Props> = ({ isOpen, handleClose }) => {
  const buttons: IButton[] = [
    { text: translate('ACTION_10'), type: 'default', onClick: handleClose }
  ];
  return (
    <LegacyModal
      isOpen={isOpen}
      title={translateRaw('DISCLAIMER')}
      buttons={buttons}
      handleClose={handleClose}
    >
      <p>
        <b>{translateRaw('DISCLAIMER_BE_SAFE')}: </b>
        <HelpLink article={KB_HELP_ARTICLE.SECURING_YOUR_ETH}>
          {translateRaw('DISCLAIMER_HELP_LINK_DESC')}
        </HelpLink>
      </p>
      <p>
        <b>{translateRaw('DISCLAIMER_ALWAYS_BACKUP_KEYS')}: </b>
        {translateRaw('DISCLAIMER_ALWAYS_BACKUP_KEYS_DESC')}
      </p>
      <p>
        <b>{translateRaw('DISCLAIMER_NOT_RESPONSIBLE_FOR_LOSS')}: </b>
        {translateRaw('DISCLAIMER_NOT_RESPONSIBLE_FOR_LOSS_DESC')}
      </p>
      <p>
        <b>{translateRaw('DISCLAIMER_DEFAULT_NETWORK_ENDORSEMENTS')}: </b>
        {translateRaw('DISCLAIMER_DEFAULT_NETWORK_ENDORSEMENTS_DESC_PART_1')} <br />
        <br />
        {translateRaw('DISCLAIMER_DEFAULT_NETWORK_ENDORSEMENTS_DESC_PART_2')}
        <br />
        <br />
        {translateRaw('DISCLAIMER_DEFAULT_NETWORK_ENDORSEMENTS_DESC_PART_3')}
      </p>
      <p>
        <b>{translateRaw('DISCLAIMER_TRANSLATIONS_OF_MYCRYPTO')}: </b>
        {translateRaw('DISCLAIMER_TRANSLATIONS_OF_MYCRYPTO_DESC')}
      </p>
      <p>
        <b>{translateRaw('DISCLAIMER_MIT_LICENSE')}</b>
        <br />
        {translateRaw('DISCLAIMER_COPYRIGHT_MYETHERWALLET')}
        <br />
        {translateRaw('DISCLAIMER_COPYRIGHT_MYCRYPTO', {
          $year: new Date().getFullYear().toString()
        })}
      </p>
      <p>{translateRaw('DISCLAIMER_PERMISSION_DESC')}</p>
      <p>{translateRaw('DISCLAIMER_COPYRIGHT_NOTICE')}</p>
      <b className="text-uppercase">{translateRaw('DISCLAIMER_THE_SOFTWARE_IS_PROVIDED_AS_IS"')}</b>
    </LegacyModal>
  );
};

export default DisclaimerModal;
