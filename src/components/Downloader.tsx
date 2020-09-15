import React, { useEffect, useState } from 'react';

import { Button, Link } from '@components';
import { getCurrentDBConfig, getExportFileName } from '@database';
import { COLORS } from '@theme';
import translate from '@translations';
import { makeBlob } from '@utils';

const Downloader: React.FC<{ data: string | object; onClick?(): void }> = ({
  data,
  onClick,
  children
}) => {
  const [blob, setBlob] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const settingsBlob = makeBlob('text/json;charset=UTF-8', data);
    setBlob(settingsBlob);
    setFileName(getExportFileName(getCurrentDBConfig(), new Date()));
  }, [data]);

  const handleDownload = () => {
    // Callback triggered after download
    if (onClick) onClick();
  };

  return (
    <Link fullWidth={true} href={blob} download={fileName} onClick={handleDownload}>
      {children}
      {!children && (
        <Button color={COLORS.WHITE} fullwidth={true}>
          {translate('SETTINGS_EXPORT_DOWNLOAD')}
        </Button>
      )}
    </Link>
  );
};

export default Downloader;
