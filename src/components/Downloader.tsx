import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { Button, Link } from '@components';
import { getExportFileName, getCurrentDBConfig } from '@database';
import { makeBlob } from '@utils';
import translate from '@translations';
import { COLORS } from '@theme';

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
    setFileName(getExportFileName(getCurrentDBConfig(), moment()));
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
