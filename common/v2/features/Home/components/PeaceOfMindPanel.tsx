import React from 'react';
import { Panel, Typography, Button } from '@mycrypto/ui';

import './PeaceOfMindPanel.scss';
import translate from 'translations';
import { GITHUB_RELEASE_NOTES_URL as DEFAULT_LINK } from 'v2/features/constants';

import vaultIcon from 'common/assets/images/icn-vault2.svg';
import protectIcon from 'common/assets/images/icn-protect.svg';
import openSourceIcon from 'common/assets/images/icn-opensource.svg';

interface ContentItemProps {
  icon: string;
  description: React.ReactElement<any>;
}

const ContentItem: React.SFC<ContentItemProps> = props => {
  const { icon, description } = props;
  return (
    <div className="item">
      <img src={icon} className="image" />
      <Typography className="description">{description}</Typography>
    </div>
  );
};

interface PeaceOfMindPanelProps {
  downloadLink: string;
}

export default function PeaceOfMindPanel(props: PeaceOfMindPanelProps) {
  const { downloadLink } = props;

  return (
    <Panel basic={true} className="PeaceOfMindPanel">
      <div className="titleArea">
        <Typography className="title">{translate('HOME_PEACE_OF_MIND_HEADER')}</Typography>
        <Typography className="description">
          {translate('HOME_PEACE_OF_MIND_DESCRIPTION')}
        </Typography>
      </div>
      <div className="content">
        <ContentItem icon={vaultIcon} description={translate('HOME_PEACE_OF_MIND_VAULT')} />
        <ContentItem icon={protectIcon} description={translate('HOME_PEACE_OF_MIND_PROTECT')} />
        <ContentItem
          icon={openSourceIcon}
          description={translate('HOME_PEACE_OF_MIND_OPENSOURCE')}
        />
      </div>
      <div className="actions">
        <Button className="button">{translate('HOME_PEACE_OF_MIND_GET_STARTED')}</Button>
        <Button className="button" onClick={() => openDownloadLink(downloadLink)}>
          {translate('HOME_PEACE_OF_MIND_DOWNLOAD')}
        </Button>
      </div>
    </Panel>
  );
}

const openDownloadLink = (link: string) => {
  const target = link === DEFAULT_LINK ? '_blank' : '_self';
  window.open(link, target);
};
