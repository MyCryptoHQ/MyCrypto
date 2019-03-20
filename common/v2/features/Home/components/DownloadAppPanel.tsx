import React from 'react';
import { Panel, Typography, Button } from '@mycrypto/ui';

import './DownloadAppPanel.scss';
import translate from 'translations';
import { GITHUB_RELEASE_NOTES_URL as DEFAULT_LINK } from 'v2/features/constants';
import champagneIcon from 'common/assets/images/icn-champagne-2.svg';

interface Props {
  OSName: string;
  downloadLink: string;
}

export default function DownloadAppPanel(props: Props) {
  const { OSName, downloadLink } = props;

  return (
    <Panel basic={true} className="DownloadAppPanel">
      <div className="callToAction">
        <Typography className="title">{translate('HOME_DOWNLOAD_TITLE')}</Typography>
        <Typography className="description">{translate('HOME_DOWNLOAD_DESCRIPTION')}</Typography>
        <Button className="button" onClick={() => openDownloadLink(downloadLink)}>
          {translate('HOME_DOWNLOAD_BUTTON')} {OSName}
        </Button>
      </div>
      <img className="image" src={champagneIcon} />
    </Panel>
  );
}

const openDownloadLink = (link: string) => {
  const target = link === DEFAULT_LINK ? '_blank' : '_self';
  window.open(link, target);
};
