import React, { useState } from 'react';
import moment from 'moment';

import { Button, Link } from '@components';
import { getExportFileName, getCurrentDBConfig } from '@database';
import { makeBlob } from '@utils';
import translate from '@translations';
import { COLORS } from '@theme';

interface DownloaderProps {
  appStore: string;
}

const Downloader = (props: DownloaderProps) => {
  const [blob, setBlob] = useState('');
  const [fileName, setFileName] = useState('');

  const handleDownload = () => {
    const settingsBlob = makeBlob('text/json;charset=UTF-8', props.appStore);
    setBlob(settingsBlob);
    setFileName(getExportFileName(getCurrentDBConfig(), moment()));
  };

  return (
    <Link fullWidth={true} href={blob} download={fileName} onClick={handleDownload}>
      <Button color={COLORS.WHITE} fullwidth={true}>
        {translate('SETTINGS_EXPORT_DOWNLOAD')}
      </Button>
    </Link>
  );
};

export default Downloader;
