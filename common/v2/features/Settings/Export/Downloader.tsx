import React, { useState } from 'react';

import { Button, Link } from 'v2/components';
import { getExportFileName } from 'v2/database';
import { makeBlob } from 'v2/utils';
import translate from 'v2/translations';
import { COLORS } from 'v2/theme';

interface DownloaderProps {
  appStore: string;
}

const Downloader = (props: DownloaderProps) => {
  const [blob, setBlob] = useState('');
  const [fileName, setFileName] = useState('');

  const handleDownload = () => {
    const settingsBlob = makeBlob('text/json;charset=UTF-8', props.appStore);
    setBlob(settingsBlob);
    setFileName(getExportFileName());
  };

  return (
    <Link fullwidth={true} href={blob} download={fileName} onClick={handleDownload}>
      <Button color={COLORS.WHITE} fullwidth={true}>
        {translate('SETTINGS_EXPORT_DOWNLOAD')}
      </Button>
    </Link>
  );
};

export default Downloader;
